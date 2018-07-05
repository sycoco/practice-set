/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */
import {Inject} from 'angular-es-utils';

import Resource from '../../../common/Resources.js';
import DataManage from '../../../common/DataManage';
import CommonCtrl from '../CommonCtrl';

@Inject('PublicService', '$ccMenus', '$scope', '$state', '$ccModal', 'TipsService', '$q', '$ccValidator', 'exDataService', '$filter')
export default class pointsRulesCtrl extends CommonCtrl {

	constructor() {
		super();
		this._PublicService.onShopChange(this.init.bind(this), this);
		this.init();
	}

	init() {
		this.showContent = false;
		this.schemas = this._$state.current.name.split('.')[2];
		this.name = DataManage.menuForPointsRules[this.schemas].name;
		this.initBasicData();
		this.initRules();
		this.initJumpFunc();
	}

	// 初始化基础数据
	initBasicData() {
		this.chooseDay = '';
		this.holderMsg = '日';
		this.value1 = 'start';

		this.value3_1 = 'pay';
		this.value3_2 = 'startToEnd';
		this.datalist1 = [{
			title: '指定开始时间',
			value: 'start'
		}, {
			title: '指定起止时间',
			value: 'startToEnd'
		}];
		this.datalist2 = [{
			title: '买家付款后',
			value: 'pay'
		}, {
			title: '买家确认收货后',
			value: 'finish'
		}];
		this.datalist3_1 = [{
			title: '买家付款后',
			value: 'pay'
		}, {
			title: '买家确认收货后',
			value: 'finish'
		}];

		this.dateRange = {
			start: new Date(2000, 2, 10),
			end: new Date(),
			minDate: new Date(2000, 1, 1),
			// 是否禁用 (false)
			disabled: false,
			// 是否显示时间 (true)
			dateOnly: false
		};
	}

	// 请求计算表达式所需数据
	initRules() {
		this._exDataService.getTheBtnData((data, customVariablesAry) => {
			this.variables = data;
			this.customVariables = customVariablesAry[0];
			this.customVariablesAry = customVariablesAry;
			this.showContent = true;
		}, error => {
			this._TipsService.showError('数据加载有误,请刷新重试:' + error.data.message);
		}, this.schemas);
		Resource.RulesResource.query({planId: DataManage.planId, schemas: this.schemas}).$promise
		.then(data => {
			this.rules = data;
			this.schemaId = data[0].schemaId || data[1].schemaId || 1;
			return data;
		});
	}

	// 设置跳转方法
	initJumpFunc() {
		this.editExpression = rule => {
			const params = {
				pointRule: rule,
				schemas: this.schemas,
				schemasName: this.name
			};
			this._$state.go('le.loyalty.ruleExpressionEditPointRule', params);
		};
		this.editCustomVariable = (variable, index, currentSchemaId, categoryName) => {

			if (!variable || !variable.id) {
				variable = {
					caption: '变量名',
					ruleFunctionName: 'SUN',
					defaultRule: '',
					categoryName: categoryName,
					id: null,
					currentSchemaId: currentSchemaId,
					ruleGroupList: []
				};
			} else {
				this.modify(variable);
				variable.formPointsRules = true;
				variable.currentSchemaId = currentSchemaId;
			}
			const params = {
				variable,
				schemaId: this.schemaId,
				schemas: this.schemas,
				schemasName: this.name
			};
			this._$state.go('le.loyalty.customVariable', params);
		};
	}

	// 修正后端数据结构和前端元数据双向绑定的逻辑的差异
	modify(variable) {
		if (!variable || !variable.ruleGroupList) {
			return;
		}
		variable.ruleGroupList.forEach(ruleGroupList => {
			ruleGroupList.ruleGroup.conditions.forEach(conditions => {
				let logic = conditions.condition.operator;
				if (logic === 'LT' || logic === 'LE') {
					conditions.condition.values.unshift('0');
				}
			});
		});
	}
	switchRule(rule, open) {
		const openStr = open ? '开启' : '关闭';
		if (open && !rule.cheked) {
			this._TipsService.showError(rule.exprContent ? '表达式有问题,请重新编辑后再开启' : '请先配置规则内容！');
			rule.currentValid = !open;
			return;
		}
		let modalInstance = this._$ccModal.confirm(`请确认是否${openStr}${rule.cardPointPlanViewCaption}规则?`, () => {});
		modalInstance.open().result.then(() => {
			this._exDataService.openThePointRule(rule, open).then(() => {
				rule.currentValid = open;
				this._TipsService.showSuccess(open ? '开启成功' : '关闭成功');
				Resource.RulesResource.query({planId: DataManage.planId, schemas: this.schemas}).$promise
				.then(data => {
					this.rules = data;
					this.rules.forEach(item => item.cheked = true);
					this.schemaId = data[0].schemaId || data[1].schemaId || 1;
				});
			}, () => {
				this._TipsService.showError('操作失败');
			});
		}, () => {
			rule.currentValid = !open;
		});


	}
	con() {
		console.log('this.rules');
		console.log(this.rules);
		console.log('this.variables');
		console.log(this.variables);
		console.log('this.customVariablesAry');
		console.log(this.customVariablesAry);
	}

}
