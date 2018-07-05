/**
 * Created by liwenjie on 2016/11/15.
 */

import angular from 'angular';

import Router from './router';

import './_style.scss';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	$stateProvider.state('le.loyalty.levelruleExpirationEdit', Router.RULE_CONDITION_EDIT);
}

export default angular.module('le.loyalty.levelruleExpirationEdit', [])
.config(memberInfoRouter)
	.name;
