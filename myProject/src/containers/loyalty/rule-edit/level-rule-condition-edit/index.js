/**
 * @author wenjie.li
 * @since 2016-10-12
 */

import angular from 'angular';

import Router from './router';

import '../_condition-style.scss';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	$stateProvider.state('le.loyalty.levelruleConditionEdit', Router.RULE_CONDITION_EDIT);
}

export default angular.module('le.loyalty.levelruleConditionEdit', [])
	.config(memberInfoRouter)
	.name;
