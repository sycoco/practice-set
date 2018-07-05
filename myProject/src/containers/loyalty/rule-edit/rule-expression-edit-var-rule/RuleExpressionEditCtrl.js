/**
 * @author wenjie.li
 * @since 2016-10-12
 */
import {Inject} from 'angular-es-utils';
import HeadTitleContainer from '../variable-head-title-container.tpl.html';

@Inject('$ccMenus', '$state', '$scope', 'TipsService', '$q', 'exDataService')
export default class RuleExpressionEditCtrl {

	constructor() {
		this.timeLineList = [{
			name: '规则设置'
		}, {
			name: '计算表达式设置'
		}];
		this.headTitleContainer = HeadTitleContainer;
		this.currentState = 1;
		// 自定义变量
		this.variable = this._$state.params['variable_condition'] || (this._$state.go('le.member.information'));
		// 编辑的规则index
		this.index = this._$state.params['ruleIndex'];
		// 当前编辑的规则
		this.rule = this.variable.ruleGroupList[this.index];
		this.schemas = this._$state.params['schemas'];
		this.schemasName = this._$state.params['schemasName'] || (this._$state.go('le.member.information'));
		this.back = 'le.loyalty.' + this.schemas;
		this._$ccMenus.onShopChange(current => {
			this._$state.go('le.loyalty.' + this.schemas);
		});

		this._exDataService.getTheBtnData(data => {
			data = data.filter(item => item.name !== 'custom');
			this.contents = data;
		}, error => {
			this._TipsService.showError('数据加载有误,请刷新重试' + error);
		}, this.schemas);
		const rules = [{
			name: '1',
			caption: this.variable.caption,
			exprContent: this.rule.valueExpr
		}];
		this.rules = rules;
		this.editExpression = () => console.log('success');
		this.editCustomVariable = variable => {
			const params = {variable};
			this._$state.go('le.loyalty.customVariable', params);
		};
	}

	// 加载操作按钮
	previousStep() {
		this.rule.valueExpr = this.rules[0].exprContent;
		this.variable.id = this.variable.id ? this.variable.id : 'new';
		this._$state.go('le.loyalty.ruleConditionEdit', {variable: this.variable});
	}

	confirm() {
		if (this.rules[0].cheked) {
			this.rule.valueExpr = this.rules[0].exprContent;
			this.variable.id = this.variable.id ? this.variable.id : 'new';
			this._$state.go('le.loyalty.customVariable', {variable: this.variable});
		} else {
			this._TipsService.showError('表达式编辑有误,请检查');
		}
	}

	cancel() {
		this._$state.go('le.loyalty.customVariable');
	}

	con() {
		console.log(this.rules);
	}
}

