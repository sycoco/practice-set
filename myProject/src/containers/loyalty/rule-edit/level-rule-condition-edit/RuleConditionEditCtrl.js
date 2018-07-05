/**
 * @author wenjie.li
 * @since 2016-10-12
 */
import ConditionEditCtrl from '../ConditionCtrl';

import { Inject } from 'angular-es-utils';

import HeadTitleContainer from '../level-head-title-container.tpl.html';

@Inject('$ccMenus', '$state', '$ccValidator', 'TipsService', '$timeout', '$scope', '$filter')
export default class LevelRuleConditionEditCtrl extends ConditionEditCtrl {

	constructor() {
		let config = {
			cancelToState: 'le.loyalty.levelruleExpirationEdit',
			headTitleContainer: HeadTitleContainer,
			nextStepFn: _ => {
				this._$state.go('le.loyalty.levelruleExpirationEdit', { editingLevelRule_condition: this.editingRule });
			},
			timeLineList: [{
				name: '规则设置'
			}, {
				name: '等级有效期设置'
			}],
			settingRuleArr: [],
			currentState: 0,
			metaResource: 'GradesMetasResource'
		};
		super(config);
		this.gradeId = this._$state.params['gradeId'];
		this.editingRule = this._$state.params['editingLevelRule'] || (this._$state.go('le.loyalty.levelRules-' + this.gradeId));
		if (this.editingRule) {
			let editingGrade = this.editingRule.allRules.filter(item => item.id === this.editingRule.configId);
			this.rule = editingGrade[0]['ruleGroup'][this.editingRule.type][this.editingRule.levelRuleIndex].source;
			this.settingRuleArr = [];
			this.initData();
			this.cancel = () => {
				this._$state.go('le.loyalty.levelRules-' + this.gradeId);
			};
		}
	}
}

