/**
 * @author wenjie.li
 * @since 2016-10-12
 */

import ConditionEditCtrl from '../ConditionCtrl';

import {Inject} from 'angular-es-utils';

import HeadTitleContainer from '../variable-head-title-container.tpl.html';

@Inject('PublicService', '$ccMenus', '$state', '$ccValidator', 'TipsService', '$timeout', '$filter', '$scope', 'goodSelector')
// @Inject('PublicService', '$ccMenus', '$state', '$ccValidator', 'TipsService', '$timeout', '$filter', '$scope')
export default class RuleConditionEditCtrl extends ConditionEditCtrl {

	constructor() {
		let config = {
			cancelToStateFn: cancelToState => {
				this._$state.go(cancelToState);
			},
			headTitleContainer: HeadTitleContainer,
			nextStepFn: () => {
				this._$state.go('le.loyalty.ruleExpressionEditVarRule', {variable_condition: this.variable});
			},
			timeLineList: [{
				name: '规则设置'
			}, {
				name: '计算表达式设置'
			}],
			settingRuleArr: [],
			currentState: 0,
			metaResource: 'RulesMetasResource'
		};
		super(config);
		// 自定义变量
		this.variable = this._$state.params['variable'] || (this._$state.go('le.member.information'));
		// 编辑的规则index
		this.index = this._$state.params['ruleIndex'];
		this.schemas = this._$state.params['schemas'];
		this.cancelToState = 'le.loyalty.' + this.schemas;
		this.schemasName = this._$state.params['schemasName'];
		this.back = 'le.loyalty.' + this.schemas;
		if (!this.variable.ruleGroupList) {
			this.variable.ruleGroupList = [];
		}
		this._PublicService.onShopChange(this.cancelToStateFn.bind(this, this.cancelToState), this);
		// 当前编辑的规则
		this.rule = this.variable.ruleGroupList[this.index].ruleGroup;
		this.initData();

	}

	cancel() {
		this._$state.go('le.loyalty.customVariable');
	}
}

