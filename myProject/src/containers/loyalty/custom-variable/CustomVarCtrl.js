/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */
import Resources from '../../../common/Resources';
import { Inject } from 'angular-es-utils';
import ExpressionService from '../../../common/Services/ExpressionService.js';
import DataManage from '../../../common/DataManage';

// import CommonCtrl from '../CommonCtrl';


@Inject('PublicService', '$ccMenus', '$scope', '$state', '$ccModal', 'TipsService', '$ccValidator', 'exDataService')
export default class CustomVarCtrl {

	constructor() {
		this.variable = this._$state.params['variable'] || (this._$state.go('le.member.information'));
		this.schemas = this._$state.params['schemas'];
		this.schemasName = this._$state.params['schemasName'];
		this.back = 'le.loyalty.' + this.schemas;
		this.variable.ruleFunctionName = this.variable && this.variable.ruleFunctionName || 'SUM';
		this.ruleList = [];
		this.showContent = false;
		/**
		 *1 父页面->新建变量           :无id全新
		 2 子页面(确定)->新建变量      :无id变量更新缓存
		 3 子页面(取消)->新建变量      :无id变量旧缓存

		 3 父页面->修改变量           :有id刷新
		 4 子页面(确定)->修改变量      :有id变量缓存
		 5 子页面(取消)->修改变量      :有id变量旧缓存

		 综上所述: 有id且从父页面进入才会刷新 否则就用从父页面或者子页面传过来的缓存
		 */

		if (this.variable.id && this.variable.formPointsRules === true) {
			this.variable.formPointsRules = false;
			Resources.CustomVarResource.get({ planId: DataManage.planId, varId: this.variable.id || '' }).$promise
				.then(data => {
					this.variable = data;
					this.ruleList = this.variable.ruleGroupList;
					this.htmlExpression();
					this.variable = this.modifyToLocal(this.variable);
					this.getLogics();
				}).catch(
				() => {
					this._TipsService.showError(`获取自定义变量${this.variable.caption}失败`);
					this._$state.go('le.loyalty.ORDER');
				}
				);
		} else {
			this.variable.ruleGroupList = this.variable.ruleGroupList.filter(item => {
				return !item.ruleGroup.conditions.some(item => {
					return item.title === '未编辑';
				}
				);
			});
			this.ruleList = this.variable.ruleGroupList;
			this.htmlExpression();
			this.variable = this.modifyToLocal(this.variable);
			this.getLogics();
		}
		this._$ccMenus.onShopChange(current => {
			this._$state.go('le.loyalty.ORDER');
		});
	}

	/**
	 *  将规则里的真值[1] + {2} 生成展现值 某变量1+ 某变量2
	 */
	htmlExpression() {
		this._exDataService.getTheBtnData(data => {
			this.contents = data;
			this.ruleList && this.ruleList.forEach(item => {
				item.expression = ExpressionService.htmlExpression(item.valueExpr, this.contents);
			});
			this.variable.defaultRule && (this.variable.defaultRuleStr = ExpressionService.htmlExpression(this.variable.defaultRule, this.contents));
		}, error => {
			this._TipsService.showError('数据加载有误,请刷新重试' + error);
		}, this.schemas);
	}

	/**
	 * 点击了规则编辑按钮
	 * @param index 第几个规则
	 */
	editClick(index) {
		this.variable.ruleFunctionName = this.logics.value.name;
		console.log(this.variable);
		this._$state.go('le.loyalty.ruleConditionEdit', { ruleIndex: index, variable: this.variable });
	}

	/**
	 * 获得 逻辑列表: SUM MAX 等
	 */
	getLogics() {
		Resources.MetaResource.query({ metaClass: 'CardPointPlanRuleExprFunction' }).$promise
			.then(data => {
				data.map(item => {
					if (item.name === 'MAX') {
						this.defaultCheck = item;
					}
					if (this.variable && this.variable.ruleFunctionName && this.variable.ruleFunctionName === item.name) {
						this.ruleFunction = item;
					}
					switch (item.name) {
						case 'MAX': item.tips = "取生效规则的变量表达式中，值最大的作为变量结果（除默认表达式）。";
							break;
						case 'MIN': item.tips = "取生效规则的变量表达式中，值最小的作为变量结果（除默认表达式）。";
							break;
						case 'SUM': item.tips = "取规则中所有生效的变量表达式的和作为变量结果（除默认表达式）。";
							break;
						case 'FIRST': item.tips = "取规则中第一个生效的变量表达式作为变量结果（除默认表达式）。";
							break;
					}
				});
				this.logics = {
					value: this.ruleFunction || this.defaultCheck,
					setting: data,
					disabled: false
				};
				this.showContent = true;
			});
	}

	/**
	 * 点击了:默认表达式输入框 跳转到默认表达式编辑界面
	 */
	jumpToRullEditor() {
		this._$state.go('le.loyalty.ruleExpressionEditVarsRule', {
			variable: this.variable
		});
	}

	/**
	 * 点击了:取消按钮 回到消费送积分页面
	 */
	backToPointsRules() {
		this._$state.go('le.loyalty.' + this.schemas);
	}

	/**
	 * 检查自定义变量的各项输入
	 */
	checkCustomVarData(type) {
		this._$ccValidator.validate(this.form)
			.then(() => {
				if (type === 'save') {
					this.confirmText = '请确认是否保存当前自定义变量？';
					this.confirm(this.confirmText, 'save');
				} else if (type === 'del') {
					if (this.variable.id === null) {
						this._$ccModal.confirm('您还未保存此自定义变量,确认删除当前自定义变量吗?', () => {
						}).open().result.then(() => {
							this.backToPointsRules();
						});
					} else {
						this.confirmText = '请确认是否删除当前自定义变量？';
						this.confirm(this.confirmText, 'del');
					}
				}
			});
	}

	/**
	 * 弹框确认 修改变量 新建变量
	 */
	confirm(text, type) {
		this.variable.ruleFunctionName = this.logics.value.name;
		if (type === 'save' && !this.checkTheVariable()) {
			return;
		}
		let modalInstance = this._$ccModal.confirm(text, () => {
			console.log('close');
		});
		console.log('this.variable');
		console.log(this.variable);
		let variableM = this.unModify(this.variable);
		console.log('variableM');
		console.log(variableM);
		modalInstance.open().result.then(() => {
			this.showContent = false;
			switch (type) {
				case 'save':
					if (this.variable.id && this.variable.id !== 'new') {
						Resources.CustomVarResource.update({ planId: DataManage.planId, varId: this.variable.id }, variableM).$promise
							.then(data => {
								this._TipsService.showSuccess('更新变量成功');
								this.backToPointsRules();
							}).catch(
							error => {
								this.showContent = true;
								this._TipsService.showError('更新变量失败:' + error.data.message);
							}
							);
					} else {
						variableM.id = undefined;
						Resources.CustomVarResource.save({ planId: DataManage.planId }, variableM).$promise
							.then(data => {
								this._TipsService.showSuccess('新建变量成功');
								this.backToPointsRules();
							}).catch(
							error => {
								this.showContent = true;
								this._TipsService.showError('新建变量失败:' + error.data.message);
							}
							);
					}
					break;
				case 'del':
					Resources.CustomVarResource.delete({ planId: DataManage.planId, varId: this.variable.id }).$promise
						.then(data => {
							this._TipsService.showSuccess('操作成功');
							this.backToPointsRules();
						}).catch(error => {
							this.showContent = true;
							// this._TipsService.showError(error.data.message);
						});
					break;
				default:
					break;
			}
		}, () => {
			console.log('取消');
		});
	}

	/**
	 * 检查自定义变量是否符合标准
	 * @returns {boolean}
	 */
	checkTheVariable() {
		if (this.variable.ruleFunctionName === '') {
			this._TipsService.showError('变量名不能为空');
			return false;
		} else if (this.variable.ruleGroupList === undefined || this.variable.ruleGroupList.length === 0) {
			this._TipsService.showError('至少有一条计算规则');
			return false;
		} else if (!this.variable.defaultRule) {
			this._TipsService.showError('请填写变量表达式!');
			return false;
		}
		return true;
	}

	/**
	 * 将后端数据结构转换成前端逻辑的数据结构:  补齐Values数组
	 * @param variable
	 * @returns {*}
	 */
	modifyToLocal(variable) {
		if (!variable.ruleGroupList) {
			return;
		}
		variable.ruleGroupList.forEach(ruleGroupList => {
			ruleGroupList.ruleGroup.conditions.forEach(conditions => {
				let logic = conditions.condition.operator;
				// if (conditions.condition.values.length === 1) {
				// 	conditions.condition.values.push(undefined);
				// }
				// if ((logic === 'LT' || logic === 'LE') && conditions.condition.values.length === 1) {
				// 	conditions.condition.values.unshift('0');
				// } else if ((logic === 'GT' || logic === 'GE' || logic === 'EQ' || logic === 'NOTEQ') && conditions.condition.values.length === 1) {
				// 	conditions.condition.values.unshift(conditions.condition.values[0]);
				// }
			});
		});
		variable.schemaId = this._$state.params['schemaId'];
		return variable;
	}

	/**
	 * 将前端数据结构转换成后端逻辑的数据结构:  修剪Values数组
	 * @param variable
	 * @returns {*}
	 */
	unModify(variable) {
		if (!variable.ruleGroupList) { return; }
		variable.ruleGroupList.forEach(ruleGroupList => {
			ruleGroupList.ruleGroup.conditions.forEach(conditions => {
				let logic = conditions.condition.operator;
				if ((logic === 'LT' || logic === 'LE' || logic === 'GT' || logic === 'GE' || logic === 'EQ' || logic === 'NOTEQ') && conditions.condition.values.length >= 2) {
					conditions.condition.values.pop();
				}
			});
		});
		variable.schemaId = this._$state.params['schemaId'];
		return variable;
	}

	con() {
		console.log('this.variable');
		console.log(this.variable);
	}
}
