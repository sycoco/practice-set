/**
 * Created by liwenjie on 2016/11/4.
 */
import {Inject} from 'angular-es-utils';

import Resource from '../../../common/Resources.js';
import * as ExpressionVariable from '../../../common/Services/ExpressionConst.js';
import DataManage from '../../../common/DataManage';

@Inject('PublicService', '$q')
export default class ExpressionDataService {
	// 请求数据
	getTheBtnData(success, failure, schemas = 'order') {
		this.systemVariables = [];
		this.methods = [];
		Resource.CustomVarsListAryResource.query({planId: DataManage.planId, schemas: schemas}).$promise.then(data => {
			let promise = data.map(vars => {
				return Resource.CustomVarsListResource.query({planId: DataManage.planId, currentSchemaId: vars.id, schemas: schemas}).$promise;
			});
			let customVarName = data.map(item => {
				return {caption: item.caption, id: item.id};
			});
			this._$q.all(promise).then(customVariablesAry => {
				customVariablesAry.forEach((item, index) => {
					item.customVariablesAryName = customVarName[index].caption;
					item.currentSchemaId = customVarName[index].id;
				});
				let system = Resource.RulesSchemasResource.query({planId: DataManage.planId, basal: 'basal', schemas: schemas}).$promise;
				let method = Resource.RulesExprFunctionResource.query().$promise;
				this._$q.all([system, method]).then(result => {
					this.systemVariables = result[0];
					this.systemVariables.forEach(item => {
						item.name = item.caption;
						item.type = 'system';
					});
					customVariablesAry.forEach(itmes => {
						itmes.forEach(item => {
							item.name = item.caption;
							item.type = 'custom';
						});
					});
					result[1].forEach(item => {
						if (item.name !== 'FIRST') { // 后端暂不支持此逻辑的规则编辑
							this.methods.push({
								name: item.name,
								caption: item.name,
								type: 'method'
							});
						}
					});
					this.contents = [{
						name: 'system',
						type: 'variable',
						caption: '通用变量：',
						variables: this.systemVariables,
						variableReg: ExpressionVariable.SYSTEM_VARIABLE_REG,
						priority: 2
					}];
					this.contents = this.contents.concat([{
						name: 'operator',
						type: 'operator',
						caption: '运算符：',
						variables: ExpressionVariable.OPERATORS,
						variableReg: ExpressionVariable.OPERATORS_REG,
						priority: 0
					}, {
						name: 'method',
						type: 'method',
						caption: '函数：',
						variables: this.methods,
						variableReg: ExpressionVariable.METHODS_REG,
						priority: 1
					}]);
					let contentsOfcustomArr = customVariablesAry.map(custom => {
						custom.forEach(item => {
							item.currentSchemaId = custom.currentSchemaId;
							item.categoryName = custom.customVariablesAryName;
						});
						return {
							name: 'custom',
							type: 'variable',
							caption: custom.customVariablesAryName + '变量：',
							variables: custom,
							variableReg: ExpressionVariable.CUSTOM_VARIABLE_REG,
							priority: 3
						};
					});
					this.contents = this.contents.concat(contentsOfcustomArr);
					success(this.contents, customVariablesAry);
				}).catch(error => {
					failure(error);
				});
			});
		});

	}


	getLogics() {
		Resource.MetaResource.query({metaClass: 'CardPointPlanRuleExprFunction'}).$promise
		.then(data => {
			data.map(item => {
				if (item.name === 'MAX') {
					this.defaultCheck = item;
				}
				if (this.variable.ruleFunctionName && this.variable.ruleFunctionName === item.name) {
					this.ruleFunction = item;
				}
			});
			this.logics = {
				value: this.ruleFunction || this.defaultCheck,
				setting: data,
				disabled: false
			};
		});
	}

	/**
	 * 把修饰逻辑词用灰色样式的标签包裹
	 * @param str
	 * @returns {*}
	 */
	logicalWordColor(str) {
		let replaceStrAry = ['不等于', '等于', '不包含', '包含', '含有', '不包含', '包含', '值为空', '晚于等于', '早于等于', '晚于', '早于', '大于等于', '大于', '小于等于', '小于', '介于', '不是', '是', '满足', '满足', '-', '到', '且', '或', '之间', '关键字'];
		replaceStrAry.forEach(replaceStr => {
			str = str.replace(new RegExp(`#${replaceStr}#`, 'g'), `<span class="prepositions">${replaceStr}</span>`);
		});
		return str;
	}


	/**
	 * 更新积分规则s (数组)
	 * @param rules 编辑的规则
	 * @param timeConfig 时间设置 下单时间/发放时间
	 * @param open 是否开启
	 * @returns {Route|app|Promise.<*>|Promise|*}
	 */
	updateRules(rules, timeConfig, open) {
		open && rules.map(item => item.enable = true);
		let promise = rules.map(item => {
			item = Object.assign(item, timeConfig);
			return Resource.UpdateRulesResource.update({
				planId: DataManage.planId,
				pointId: item.cardPointPlanId,
				ruleUnionId: item.unionId
			}, item).$promise;
		});
		this.showContent = false;
		return this._$q.all(promise);
	}

	/**
	 * 开启或关闭一个规则
	 * @param item
	 * @param open
	 * @returns {*|Function}
	 */
	openThePointRule(item, open) {
		return Resource.SwitchRulesResource.update({
			planId: DataManage.planId,
			pointId: item.cardPointPlanId,
			ruleUnionId: item.unionId
		}, open).$promise;
	}
	insertExpressionContent(obj, content) {
		obj._$scope.$broadcast('insertContent', content);
	}
}

// export default new ExpressionDataService();
