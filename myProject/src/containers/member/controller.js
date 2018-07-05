/**
 * Created by zhouxing on 2016/10/24.
 */
import Resources from '../../common/Resources';
import marketingUrl from './marketing-immediately/marketing-immediately.html';
import MarketingCtrl from './marketing-immediately/controller';

import exportModleUrl from '../other/exportList/creatExportIssue/creatExportIssueTpl.html';
import exportModleCtrl from '../other/exportList/creatExportIssue/creatExportIssueCtl';

import angular from 'angular';
import DataManage from '../../common/DataManage';

export default class MainCtrl {

	constructor(config) {
		this.config = config;
		this.config.showLeadBtn = DataManage.isPermit(this.config.showLeadBtn);
		this.config.showExportBtn = DataManage.isPermit(this.config.showExportBtn);
		this.showContent = true;
		this.first = true;
		this.isPermit = DataManage.isPermit;
		this._PublicService.onShopChange(() => {
			this.initAllow = true;
			this.init.apply(this);
			this.tempTip();
		}, this);
	}

	exportIssue() {
		let desc = this.descString();
		const modalInstance = this._$ccModal
		.modal({
			title: '创建文件导出任务',
			body: exportModleUrl,
			controller: exportModleCtrl,
			bindings: {
				desc: desc,
				number: 123,
				title: this.config.label
			},
			style: {
				'min-width': '300px',
				'width': '300px',
				'height': '300px',
				'min-height': '300px'
			}
		}).open();
		modalInstance.result.then(() => {
			this.fillOpts(this.queryFilters);
			let exportParam = Object.assign(this.param.param);
			exportParam = JSON.stringify(exportParam);
			Resources.MemberFileExport.save(
				{planId: this._PublicService.planId, exportType: this.config.exportType},
				{
					exportCondition: exportParam,
					desc: desc,
					exportType: this.config.exportType
				}).$promise.then(data => {
					this._TipsService.showSuccess('创建成功，请在文件导出列表中查看');
				}, error => {
					console.log(error);
					// this._TipsService.showError('创建导出任务失败' + (error.data.message || ''));
				});
		}, () => {
			console.log('取消创建导出任务');
		});
	}

	fillOpts(_param = []) {

		this.param = {
			planId: this._PublicService.planId,
			param: {
				cardPlanId: this._PublicService.planId
			},
			page: {
				currentPage: 1,
				pageSize: 20
			}
		};

		_param.forEach(item => {
			item.keys.forEach((key, index) => {
				if (angular.isDate(item.values[index])) {
					if (index === 1) {
						this.param.param[key] = this._$filter('date')(item.values[index], 'yyyy-MM-dd 23:59:59');
					} else {
						this.param.param[key] = this._$filter('date')(item.values[index], 'yyyy-MM-dd HH:mm:ss');
					}
				} else {
					this.param.param[key] = item.values[index];
				}
				this.param.param[key] = this.param.param[key] === 0 ? 0 : (this.param.param[key] || undefined);
			});
		});
		this.isLoadComplete ? this.search() : ((this.isLoadComplete = true) && (this.tempTip()));
	}

	tempTip() {
		this._$timeout(() => {
			let elm = angular.element(document.querySelector('.msg'));
			elm && elm[0] && (elm[0].innerHTML = '请点击<span onclick="window.QUERY_FILTER_SEARCH_BTN_CLICK()"><a>搜索</a></span>后再查看数据');
		});
	}

	search(_param) {
		if (this.first && !(this._$location && this._$location.$$search.name)) {
			this.first = false;
			return;
		}
		this.showContent = false;
		if (_param) {
			this.param.page = {
				currentPage: _param.queryParams.pageNum,
				pageSize: _param.queryParams.pageSize
			};
		}
		Resources[this.resourcePool.searchResource].query(this.param, (data, responseHeaders) => {
			let pager = responseHeaders();
			this.memberListGridOption.pager = {
				totals: +pager['x-page-total-count'],
				totalPages: Math.ceil(+pager['x-page-total-count'] / +pager['x-page-page-size']),
				pageNum: +pager['x-page-current-page'],
				pageSize: +pager['x-page-page-size']
			};
			this.memberListGridOption.externalData = data;
			girdBugTempFixFunc.apply(this);
			this._$ccGrid.refresh(this.memberListGridOption);
			this.showContent = true;
			this._$timeout(() => { // 接口不支持总条数的时候,需要删除对应的UI~
				if (this.memberListGridOption.pager.totals === -1) {
					this.memberListGridOption.pager.totals = 50000000;
					this.memberListGridOption.pager.totalPages = 10000000;
					let ele = document.querySelector('.total-items-count');
					ele.style.display = 'none';
					let ele1 = document.querySelector('.pagination .first');
					ele1.style.display = 'none';
					let ele2 = document.querySelector('.pagination .last');
					ele2.style.display = 'none';
					let ele3 = document.querySelector('.pagination .jump span');
					ele3.style.display = 'none';
					let ele4 = document.querySelector('.pagination .jump');
					ele4.childNodes[6].textContent = '';
					ele4.childNodes[8].textContent = '';
				}
			}, 0);
		}, error => {
			this._TipsService.showError((error && error.data.message) || '查询错误');
			this.showContent = true;
		});
		function girdBugTempFixFunc() {
			// 这行代码无效，因为组件gird不支持二次配置emptyTipTpl：
			this.memberListGridOption.emptyTipTpl = '<div class="init-msg"><span class="warning"></span><span class="msg">未查询到符合条件的数据</div>';
			// 所以需要用这个timeout来解决问题：
			this._$timeout(() => {
				let elm = angular.element(document.querySelector('.msg'));
				elm && elm[0] && (elm[0].innerHTML = '未查询到符合条件的数据');
			});
		}
	}
	descString() {
		let str = '';
		let i = 1;
		this.queryFilters.forEach((item, index) => {
			if (item.displayName && item.values) {
				let valuDes = item.values.join('');
				if (valuDes) {
					if (item.options) {
						valuDes = item.options.filter(option => option.value === item.values[0])[0].title;
					} else if (item.values instanceof Array && item.viewType !== 'INPUT_STR') {
						if (angular.isDate(item.values[0]) || angular.isDate(item.values[1])) {
							valuDes = this.dateValueToTitle(item.values[0], item) + '到' + this.dateValueToTitle(item.values[1], item) + '之间';
						} else {
							valuDes = (item.values[0] || 0) + '到' + (item.values[1] || '∞') + '之间';
						}
					}
					str += `【${i++}】&nbsp` + item.displayName + ':&nbsp&nbsp' + valuDes + '<br>';
				}
			}
		});
		str = str || '所有数据';
		return '<p>' + str + '</p>';
	}

	marketing() {
		const modalInstance = this._$ccModal
		.modal({
			title: '立即营销',
			body: marketingUrl,
			controller: MarketingCtrl,
			bindings: true
		}).open();

		modalInstance.result.then(v => {
			console.log('resolved', v);
		}, v => {
			console.log('rejected', v);
		});
	}
	dateValueToTitle(value, meta) {
		let time = 'yyyy年MM月dd日';
		if (meta.viewType === 'DATETIME') {
			time = 'yyyy年MM月dd日 HH时mm分ss秒';
		}
		return value && this._$filter('date')(Date.parse(value), time) || '∞';
	}
}
