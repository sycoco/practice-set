/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import Router from './router';

import './_custom-var.scss';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	$stateProvider.state('le.loyalty.customVariable', Router.CUSTOM_VAR);
}

export default angular.module('le.loyalty.customVariable', [])
	.config(memberInfoRouter)
	.name;
