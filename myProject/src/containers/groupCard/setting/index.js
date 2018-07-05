/**
 * Created by liwenjie on 2016/12/15.
 */

import angular from 'angular';

import Router from './router';

import './_style.scss';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	$stateProvider.state('le.groupCard.setting', Router.GROUP_CARD_SETTING);
}

export default angular.module('le.groupCard.setting', [])
.config(memberInfoRouter)
	.name;
