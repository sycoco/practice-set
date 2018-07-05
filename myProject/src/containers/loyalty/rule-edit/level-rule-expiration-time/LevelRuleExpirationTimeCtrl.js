/**
 * Created by liwenjie on 2016/11/11.
 */


import HeadTitleContainer from '../level-head-title-container.tpl.html';
// import * as DateCommon from '../../../../common/utils/date-format';


import {Inject} from 'angular-es-utils';

@Inject('$ccMenus', '$state', '$ccValidator', 'TipsService', '$timeout', '$scope')
export default class LevelRuleConditionEditCtrl {

	constructor() {
		this.timeLineList = [{
			name: '规则设置'
		}, {
			name: '等级有效期设置'
		}];
		this.cyclelist = [
			{title: '天', value: 'DAY'},
			{title: '月', value: 'MOUNTH'},
			{title: '年', value: 'YEAER'}
		];
		this.headTitleContainer = HeadTitleContainer;
		this.timeConfigType = 1;
		this.cycle1 = 'DAY';
		this.overdueStrategyConfig = {};
		this.currentState = 1;
		this.yearInterval = 1;
		this.showContent = true;
		this.gradeId = this._$state.params['gradeId'];
		this.editingRule = this._$state.params['editingLevelRule_condition'] || (this._$state.go('le.member.information'));
		let editingGrade = this.editingRule.allRules.filter(item => item.id === this.editingRule.configId);
		this.Rule = editingGrade[0]['ruleGroup'][this.editingRule.type][this.editingRule.levelRuleIndex];
		this.rule = this.Rule.source;
		this.timeConfigObj = this.rule;
	}
	timeConfigUI(timeConfig) {
		switch (timeConfig.intervalTimeUnit || '') {
			case 'FOREVER':
				this.timeConfigType = 4;
				break;
			case 'MOUNTH':
				this.timeConfigType = 2;
				this.everyInterval = timeConfig.interval;
				break;
			case 'DAY':
				this.timeConfigType = 2;
				this.everyInterval = timeConfig.interval;
				break;
			case 'YEAR':
				this.timeConfigType = 3;
				this.everyInterval = timeConfig.interval;
				this.yearInterval = timeConfig.interval;
				if (timeConfig.fixValue === '12:31') {
					this.timeConfigType = 1;
					this.fixValue = ['12', '31'];
				}
				break;
			default:
				this.timeConfigType = 4;
				break;
		}
	}
	nextStep() {
		this._$scope.$broadcast('nextStep');

		this.rule.effectiveTypeName = this.timeConfigObj.result.type;
		this.rule.effectiveContentConfig = this.timeConfigObj.result.timeConfig;
		// this.Rule.effectiveContentConfig = this.timeObj.timeConfig;
		this.Rule.validity = this.timeConfigObj.result.validityTitle;
		console.log('this.rule');
		console.log(this.rule);
		console.log('this.Rule');
		console.log(this.Rule);

		console.log('this.editingRule');
		console.log(this.editingRule);
		this._$state.go('le.loyalty.levelRules-' + this.gradeId, {editingRule: this.editingRule});
	}
	cancel() {
		this._$state.go('le.loyalty.levelRules-' + this.gradeId);
	}
}
