/**
 * Created by liwenjie on 2017/2/22.
 */
import {Inject} from 'angular-es-utils';
import DataManage from '../../../common/DataManage';
// import angular from 'angular';
import Resource from '../../../common/Resources.js';
import exportModleUrl from './configModalConfirm/configModalConfirmTpl.html';
import exportModleCtrl from './configModalConfirm/configModalConfirmCtl';

import modalTpl from './selectShop/modal.html';
import modalCtrl from './selectShop/ctrl';

import {CONFIG_ARRY} from './allConfig';

@Inject('$state', '$ccMenus', 'TipsService', '$ccModal', '$q')
export default class Home {
	constructor() {
		CONFIG_ARRY.forEach(item => {
			item.columnsDef.forEach(item => {
				item.option && (item.value = item.value || item.option[0].value);
			});
		});
		this.configArry = CONFIG_ARRY;
		this.configArry.forEach(item => {
			item.formToParm = () => {
				let parm = {};
				item.columnsDef.forEach(item => {
					!item.unIncluded && (parm[item.fieldName] = item.value);
				});
				item.parm = parm;
				return parm;
			};
			item.parmToform = () => {
				// let parm = item.parm;
				let parm = JSON.parse(item.parmString);
				item.columnsDef.forEach(item => {
					!item.unIncluded && (item.value = parm[item.fieldName]);
				});
			};
		});
		this.loadData();
		this.shopManage = this.getAllShop();
	}

	// 所有的店铺
	getAllShop() {
		let obj = [
			{
				caption: '数据加载中',
				shopPlan: [{
					caption: '数据加载中',
					plans: {
						gradPlan: [{
							caption: '数据加载中',
							gradList: [{
								caption: '数据加载中'
							}]
						}],
						pointPlan: [{
							caption: '数据加载中'
						}]
					}
				}]
			}
		];
		return obj;
	}

	loadData() {
		this.loadShop().then(data => {
			this.shopSelectList = data;
			this.shopManage = data.map(shop => {
				return {
					caption: shop.caption,
					...shop
				};
			});
			this.shopManage.forEach(shop => {
				shop.loadShopDetailFn = this.loadShopDetailData.bind(this, shop);
			});
		});
		this.didLoad = {
		};
		const configUse = {
			platCaption: '平台名',
			gradeRuleExecuteDate: '等级规则固定开始时间默认值',
			gradeDataCountDateStart: '等级规则时间默认值',
			showPermissionList: '是否需要权限',
			showSynchronousGrade: '是否需要展示平台绑定等级',
			showTimelyMarket: '是否显示立即营销',
			gradeRecordCondition: '等级变更记录搜索筛选项',
			gradeRecordDetail: '等级变更记录表格数据展示项',
			infoRecordCondition: '信息变更记录搜索筛选项',
			infoRecordDetail: '信息变更记录表格数据展示项',
			pointRecordCondition: '积分变更记录筛选项',
			pointRecordDetail: '积分变更记录表格数据展示项'
		};
		let configGrid = [];
		for (let key in configUse) {
			let value = DataManage.allConfig[key];
			if (value instanceof Array) {
				value = value.filter(item => item.displayName).map(item => {
					let className = item.show ? 'show' : 'hide';
					return `<span class="config-item ${className}">${item.displayName}</span>`;
				}).join(' ');
			}
			configGrid.push({
				key: key,
				value: value,
				use: configUse[key]
			});
		}
		// let configGrid = DataManage.allConfig;
		this.configOpts = {
			externalData: configGrid,
			showPagination: false,
			columnsDef: [{
				field: 'key',
				displayName: '字段',
				align: 'left',
				width: '20%'
			}, {
				field: 'value',
				displayName: '当前值',
				align: 'left',
				cellTemplate: '<div cc-bind-html="entity.value"></div>'
			}, {
				field: 'use',
				displayName: '作用',
				align: 'left'
			}],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">暂无数据</div>'
		};
	}
	loadShopDetailData(shop) {
		if (this.didLoad[shop.id]) {
			return;
		}
		this.didLoad[shop.id] = true;
		Resource.PlanResource.get({unitId: shop.id}).$promise.then(data => {
			shop.planId = data.planId;
			shop.shopPlan = [{
				caption: shop.caption + '卡计划',
				plans: {
					gradPlan: [],
					pointPlan: [{
						caption: '记载中,请稍后'
					}]
				}
			}];
			return Resource.MemberGradePlan.query({planId: data.planId}).$promise;
		}).then(gradList => {
			shop.shopPlan[0].plans.gradPlan = gradList.map(gradplan => {
				return {
					id: gradplan.id,
					caption: gradplan.caption,
					gradList: [{
						caption: '加载中,请稍后'
					}]
				};
			});
			shop.shopPlan[0].plans.gradPlan.forEach(grade => {
				Resource.MemberCardsSettingLevel.query({
					planId: shop.planId,
					gradeId: grade.id
				}).$promise.then(list => {
					grade.gradList = list;
				});
			});
			Resource.MemberCardsSettingPlantPoints.query({planId: shop.planId}).$promise.then(pointList => {
				shop.shopPlan[0].plans.pointPlan = pointList;
			});
		});
	}

	switchCodeStyle(config) {
		config.codeStyle = !config.codeStyle;
		if (config.codeStyle) {
			config.formToParm();
			config.parmString = JSON.stringify(config.parm);
		} else {
			config.parmToform();
		}
	}

	expand(arry, expand) {
		arry.forEach(item => {
			item.expand = !!expand;
		});
	}

	// 提交数据
	submit(requestObj) {
		let parm = {};
		if (requestObj.codeStyle) {
			try {
				parm = JSON.parse(requestObj.parmString);
			} catch (e) {
				this._TipsService.showError('JSON格式有误，请检查');
				return;
			}
		} else {
			parm = requestObj.formToParm();
		}
		!requestObj.onlyCodeStyle && this.switchCodeStyle(requestObj);
		!requestObj.onlyCodeStyle && (requestObj.codeStyle = !requestObj.codeStyle);
		const modalInstance = this._$ccModal
		.modal({
			title: '请确认配置项',
			body: exportModleUrl,
			controller: exportModleCtrl,
			bindings: {
				requestObj: requestObj,
				title: requestObj.girdCaption
			},
			style: {
				'min-width': '400px',
				'width': '400px',
				'height': '400px',
				'min-height': '400px'
			}
		}).open();
		modalInstance.result.then(() => {
			let urlParm = {planId: parm.planId, gradeId: parm.gradeId, orgId: parm.orgId};
			Resource[requestObj.resource].save(urlParm, parm).$promise.then(data => {
				this._$ccModal.confirm(requestObj.girdCaption + '请求成功', () => {
				}).open();
			}, error => {
				this._TipsService.showError(requestObj.girdCaption + '请求失败' + error.data.message);
			});
		}, () => {
			console.log('取消发送');
		});
	}

	reset(requestObj) {
		requestObj.columnsDef.forEach(item => {
			if (item.option) {
				item.value = '';
			} else {
				item.value = '';
			}
		});
	}

	openShopSelector(item, requestObj) {
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
			// item.value = data[0].id;
			item.valueCaption = data[0].caption;
			this.loadGradeList(data[0].id, item).then(data => {
				item.gradePlanList = data;
				this.freshGradPlanList(requestObj, item);
			});
		}, error => {
			console.log('rejected', error);
		});
	}

	// 选择店铺后，加载等级列表到这个对象上
	loadGradeList(platId, item) {
		return Resource.PlanResource.get({unitId: platId}).$promise.then(data => {
			item.value = data.planId;
			return Resource.MemberGradePlan.query({planId: data.planId}).$promise;
		}).then(data => {
			if (data.length === 0) {
				return [{
					title: `请先为该${DataManage.allConfig.unitViewCaption || '店铺'}新建一个等级计划`,
					value: ''
				}];
			}
			return data.map(item => {
				return {
					title: item.caption,
					value: item.id + ''
				};
			});
		});
	}

	// 给等级计划列表赋值
	freshGradPlanList(requestObj, shopColum) {
		let gradesColumnsDef = requestObj.columnsDef.filter(item => item.gradeSelect);
		if (gradesColumnsDef.length > 0) {
			let columnsDef = gradesColumnsDef[0];
			columnsDef.option = shopColum.gradePlanList;
			columnsDef.value = columnsDef.option[0].value;
		}
	}

	loadShop() {
		return Resource.GroupCardAllPointRule_GET.query().$promise.then(data => {
			data.forEach(item => {
				if (!item.pointPlanList || item.pointPlanList.length === 0) {
					item.pointPlanList = [{viewCaption: `该${DataManage.allConfig.unitViewCaption || '店铺'}没有配置积分`, id: null}];
					item.pointPlanList.noData = true;
				}
			});
			return data;
		});
	}
}
