/**
 * @author Jocs
 * @since 2016-11-24
 */
import { Inject } from 'angular-es-utils';
import defaultParams from './params';
import angular from 'angular';
import Resource from '../../common/Resources';
import DataManage from '../../common/DataManage';
// const preUrl = window.rootOrigin + '/web-rocket/v1/';
// const preUrl = '//qa-ual.fenxibao.com' + '/web-rocket/v1/';

@Inject('$ccValidator', 'TipsService', '$state', 'modalInstance', 'data', 'PublicService', '$timeout')
export default class GoodSelectorCtrl {
	constructor() {
		// payloads 分页post请求发出去的数据
		this.payloads = defaultParams;
		// 添加shopId
		Object.assign(this.payloads, {shopId: this._PublicService.shopId});
		// 接口获取到的商品列表
		this.preList = [];
		// 选择的商品列表
		this.secList = [];
		// 分页器所需数据
		this.paginator = {
			pageList: [10, 15, 20, 30, 50],
			total: 0,
			totalPages: 0
		};
		this.preCheck = false; // preList 全选按钮绑定数据
		this.secCheck = false; // secList 全选按钮绑定数据
		// 如果已经有选择的商品了，那么需要初始化数据
		// 重写确定按钮事件处理函数
		this.ok = () => {
			// 如果是查看状态，确认按钮直接调用取消按钮的函数
			if (this._data.lookup) return this._modalInstance.cancel();
			this._modalInstance.ok(this.secList.map(p => (p.numIid)));
		};
		this.init(); // 初始化已经选择的商品。
		this.resetSearchCondition(); // 进入商品选择器，重置所有搜索条件。
		this.search(1, 10); // 打开商品选择器，默认初始搜索全部（包括上架和未上架）
	}
	init() {
		const { goodIds } = this._data;
		if (goodIds && goodIds.length > 0) {
			let parm = {
				page: 1, // 当前页数
				pagesize: 150, // 每页显示条数
				pageSize: 150, // 每页显示条数(与pagesize相同,任一均可)
				numIids: goodIds.map(item => item + '') // 商品id值
			};
			this.getGoodsPromise(parm).then(res => {
				if (res) {
					this.secList = res.data ? res.data.map(p => Object.assign(p, {selected: false})) : [];
				} else {
					this._TipsService.showError('您之前所选的商品已被删除', true);
				}
			}).catch(() => {
				this._TipsService.showError('获取商品列表失败。', true);
			});
		}
		// 获取分类
		(function() {
			this.productClassifyNameObj = {};
			Resource.ProductClassifyResource.query().$promise.then(data => {
				this.productClassify = [{title: '不限', value: undefined}].concat(data.map(item => {
					this.productClassifyNameObj[item.id] = item.name;
					return {
						title: item.name,
						value: item.id
					};
				}));

				this.payloads.leafCidChoice = undefined;
			});
		}.call(this));
	}
	/**
	 * 搜索按钮及分页回调需要的函数
	 */
	search(page = 1, pagesize = 20) {
		Object.assign(this.payloads, {page, pagesize});
		if (this.payloads.isOnsale === 'false') this.payloads.isOnsale = 'all';
		let parm = {
			page: page, // 当前页数
			pagesize: pagesize || undefined, // 每页显示条数
			pageSize: pagesize || undefined, // 每页显示条数(与pagesize相同,任一均可)
			minPrice: this.payloads.minPrice, // 商品价格最小值(包括)
			maxPrice: this.payloads.maxPrice, // 商品价格最大值(包括)
			// numiid: "123", // 商品id值
			query: this.payloads.query // 商品标题值,模糊查询值
		};
		if (this.payloads.leafCidChoice) {
			parm.productCustomCategoryVO = {
				leafCid: [this.payloads.leafCidChoice + '']
			};
		}
		this.getGoodsPromise(parm).then(res => {
			if (res) {
				this.preList = res.data ? res.data.map(p => Object.assign(p, {selected: false})) : [];
				Object.assign(this.payloads, {page, pagesize: res.pageSize});
				Object.assign(this.paginator, {total: res.total, totalPages: Math.ceil(res.total / res.pageSize)});
				this.preCheck = false; // preList 全选按钮绑定数据
			} else {
				this._TipsService.showError(`该${DataManage.allConfig.unitViewCaption || '店铺'}商品列表为空`, true);
			}
		}).catch(() => {
			this._TipsService.showError('获取商品列表失败。', true);
		});

	}
	getGoodsPromise(parm) {
		return Resource.ProductSearchPageResource.save(parm).$promise;
	}
	/**
	 * 重置搜索条件函数
	 */
	resetSearchCondition() {
		const emptyQueryParams = {
			mumiid: null,
			query: '',
			isOnsale: 'false',
			maxPrice: null,
			minPrice: null,
			leafCidChoice: undefined
		};
		Object.assign(this.payloads, emptyQueryParams);
	}
	/**
	 * 两个list中间添加按钮。
	 */
	add() {
		const cidList = this.secList.map(p => p.numIid);
		this.preList.filter(p => p.selected).forEach(p => {
			if (cidList.indexOf(p.numIid) === -1 && this.secList.length < 150) this.secList.push(Object.assign(angular.copy(p), {selected: false}));
		});
	}
	/**
	 * 两个选择全部的checkbox
	 */
	selectAll(type, bool) {
		this[type].forEach(p => { p.selected = bool; });
	}
	/**
	 * 删除已经选择，分为删除选择的全部，和单个。type为all,删除全部，type为single,删除单个，第二个参数为numIid
	 */
	delete(type, id) {
		switch (type) {
			case 'all':
				this.secList = this.secList.filter(p => p.selected === false);
				this.secCheck = false;
				break;
			case 'single':
				this.secList.filter(p => p.numIid === id)[0].delete = true;
				this._$timeout(() => {
					this.secList = this.secList.filter(p => p.numIid !== id);
				}, 300);
				break;
		}
	}
}
