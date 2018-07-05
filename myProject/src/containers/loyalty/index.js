/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-27
 */

import angular from 'angular';

import ExpressionDataService from './expression-service/ExpressionDataService';

import levelRulesModule from './level-rules';
import memberCardsModule from './member-cards';
import pointsModule from './points-rules';
import customVarModule from './custom-variable';

import ruleConditionEdit from './rule-edit/rule-condition-edit';
import levelruleConditionEdit from './rule-edit/level-rule-condition-edit';
import leveRuleExpirationEdit from './rule-edit/level-rule-expiration-time';

import ruleExpresstionEditPoint from './rule-edit/rule-expression-edit-point';
import ruleExpresstionEditVarRule from './rule-edit/rule-expression-edit-var-rule';
import ruleExpresstionEditVarsRule from './rule-edit/rule-expression-edit-vars-rule';

import './points-rules/_points-rules.scss';

import Router from './router';

loyaltyRouter.$inject = ['$stateProvider'];
function loyaltyRouter($stateProvider) {
	$stateProvider.state('le.loyalty', Router.LOYALTY);
}

export default angular.module('ccms.le.loyalty',
	[pointsModule, levelRulesModule, memberCardsModule, customVarModule, ruleConditionEdit, ruleExpresstionEditPoint, ruleExpresstionEditVarRule, ruleExpresstionEditVarsRule, levelruleConditionEdit, leveRuleExpirationEdit])
.config(loyaltyRouter)
.service('exDataService', ExpressionDataService)
	.name;
