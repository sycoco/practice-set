/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import Router from './router';

import './_member-cards.scss';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	$stateProvider.state('le.loyalty.memberCards', Router.MEMBER_CARDS);
}

export default angular.module('le.loyalty.memberCards', [])
	.config(memberInfoRouter)
	.name;
