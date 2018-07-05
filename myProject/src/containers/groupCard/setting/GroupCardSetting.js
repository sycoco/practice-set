/**
 * Created by liwenjie on 2016/12/15.
 */

import {Inject} from 'angular-es-utils';
import modalTpl from './selectShop/modal.html';
import modalCtrl from './selectShop/ctrl';
import DataManage from '../../../common/DataManage';

@Inject('GroupCardService', '$timeout', '$ccModal', '$ccGrid', '$q', '$ccMenus', '$ccValidator', 'TipsService')
export default class GroupCardSetting {

	constructor() {
		this.configGrid();
		this.loadData();
		this._$ccMenus.onShopChange(() => {
			this.loadData();
		});
	}

	/**
	 * 加载所有数据
	 */
	loadData() {
		this.showContent = false;
		this.unit = DataManage.allConfig.unitViewCaption || '店铺';
		this._$ccMenus.getCurrentPlatShop().then(data => { // 获取卡计划ID 和卡计划名称
			this.currentPlatShop = data;
			this.oldCardName = data.shop.caption;
			return this._$q.all([this._GroupCardService.getPointPlanList(this.currentPlatShop.shop.id), this._GroupCardService.getShopList(), this._GroupCardService.getAllShopAndPointBindList()]);
		}).then(data => { // 获取该卡计划下的所有积分列表 获取所有店铺
			this.pointPlantList = data[0];
			this.synchronous = [{title: '不参与集团积分', value: undefined}];
			this.synchronous = this.synchronous.concat(data[0].map(item => {
				return {
					title: item.viewCaption,
					value: item.id
				};
			}));
			this.shopSelectList = data[1];
			console.log('data[2]');
			console.log(data[2]);
			this._GroupCardService.getShopAndPointBindList(this.pointPlantList[0].cardPlanId, this.shopSelectList, data[2]).then(data => { // 获取所有该开计划下的所有绑定关系
				this.setGridHeight(data);
				this.shopPointAndCarGroupBindGirdData = data;
				this.cardAndPointGridOption.externalData = this.shopPointAndCarGroupBindGirdData;
				this.showContent = true;
				this._$ccGrid.refresh(this.cardAndPointGridOption);
			});
		}).catch(() => {
			this._TipsService.showError('数据加载出错');
		});

	}
	configGrid() {
		this.cardAndPointGridOption = {
			externalData: this.shopPointAndCarGroupBindGirdData,
			showPagination: false,
			columnsDef: [{
				field: 'title',
				displayName: `${DataManage.allConfig.unitViewCaption || '店铺'}名称`,
				align: 'left',
				cellTemplate: '<span class="iconfont icon-taobao-fill" ng-style="{\'height\': (entity.pointPlanList.length * 42) + \'px\'}" style="color: #ff4401; line-height: 42px; margin-right: 5px"></span><span class="ellipsis" style="line-height: 42px;" title="{{entity.caption}}">{{entity.caption}}</span>',
				width: '40%'
			}, {
				displayName: `${DataManage.allConfig.unitViewCaption || '店铺'}积分名称`,
				align: 'left',
				cellTemplate: '<div class="cell-wrap" ng-style="{\'height\': (entity.pointPlanList.length * 42) + \'px\'}"><div ng-repeat="item in entity.pointPlanList">{{item.viewCaption}}</div></div>'
			}, {
				field: 'baodi',
				displayName: '转换',
				align: 'left',
				cellTemplate: '<div ng-hide="entity.pointPlanList.noData" class="cell-wrap" ng-style="{\'height\': (entity.pointPlanList.length * 42) + \'px\'}"><div ng-repeat="item in entity.pointPlanList" style="transform: rotate(-90deg); color: #666666" class="iconfont icon-turn"></div></div>',
				width: '13%'
			}, {
				displayName: '集团积分名称',
				align: 'left',
				cellTemplate: '<div ng-hide="entity.pointPlanList.noData" class="cell-wrap" ng-style="{\'height\': (entity.pointPlanList.length * 42) + \'px\'}"><cc-dropdown-select ng-repeat="item in entity.pointPlanList" model="item.gatherPointPlanId"' +
				'datalist="$ctrl.synchronous">' +
				'	</cc-dropdown-select></div>'
			}],
			emptyTipTpl: `<div class="init-msg"><span class="warning"></span><span class="msg">请选择${DataManage.allConfig.unitViewCaption || '店铺'}</div>`
		};
	}
	openShopSelector() {
		if (!this.shopSelectList) {
			return;
		}
		const modalInstance = this._$ccModal
		.modal({
			title: `${DataManage.allConfig.unitViewCaption || '店铺'}选择`,
			body: modalTpl,
			controller: modalCtrl,
			style: {
				'min-width': '680px',
				'width': '680px',
				'height': '306px',
				'min-height': '306px'
			},
			bindings: {
				shopList: this.shopSelectList
			}
		}).open();

		modalInstance.result.then(data => {
			this.shopPointAndCarGroupBindGirdData = data;
			console.log('data');
			console.log(data);
			this.cardAndPointGridOption.externalData = data;
			this.setGridHeight(data);
			this._$ccGrid.refresh(this.cardAndPointGridOption);
		}, error => {
			console.log('rejected', error);
		});
	}

	/**
	 * 设置表格高度
	 * @param data 表格的数据
	 */
	setGridHeight(data) {
		let cellHeight = data.reduce((a, b) => {
			return a + ((b.pointPlanList.length * 42) + 1);
		}, 0);
		cellHeight = (cellHeight === 0) ? 60 : cellHeight;
		this.gridheight = (cellHeight + 83) + 'px';
	}

	/**
	 * 积分名称实时变化
	 */
	changeThePointName() {
		this.synchronous = [{title: '不参与集团积分', value: undefined}];
		this.synchronous = this.synchronous.concat(this.pointPlantList.map(item => {
			return {
				title: item.viewCaption,
				value: item.id
			};
		}));
	}
	save() {
		this._$ccValidator.validate(this.form).then(() => {
			console.log('通过了校验');
			let gatherConfigList = this.shopPointAndCarGroupBindGirdData.reduce((a, b) => {
				return a.concat(b.pointPlanList);
			}, []);
			gatherConfigList = gatherConfigList.map(item => {
				return {
					pointPlanId: item.id,
					gatherPointPlanId: item.gatherPointPlanId
				};
			});
			gatherConfigList = gatherConfigList.filter(item => item.gatherPointPlanId);
			let pointPlanList = this.pointPlantList.map(item => {
				return {
					id: item.id,
					viewCaption: item.viewCaption
				};
			});
			this._GroupCardService.putShopAndPointBindList(this.currentPlatShop.shop.caption, pointPlanList, gatherConfigList, this.currentPlatShop.shop.id).then(() => {
				if (this.oldCardName !== this.currentPlatShop.shop.caption) {
					location.reload();
				} else {
					this.loadData();
					this._TipsService.showSuccess('保存成功');
				}
			});
		});
	}
	cancel() {
		this.loadData();
	}
}
