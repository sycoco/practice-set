/**
 * @author wenjie.li
 * @since 2016-10-12
 */

import angular from 'angular';

import Router from './router';

import '../_rule-expression-style.scss';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	$stateProvider.state('le.loyalty.ruleExpressionEditVarsRule', Router.RULE_EXPRESSION_EDIT);
}

export default angular.module('le.loyalty.ruleExpressionEditVarsRule', [])
	.config(memberInfoRouter)
	.name;
