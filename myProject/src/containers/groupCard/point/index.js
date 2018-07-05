/**
 * Created by liwenjie on 2016/12/15.
 */

import angular from 'angular';

import Router from './router';

import '../../../containers/member/_member.scss';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	$stateProvider.state('le.groupCard.point', Router.GROUP_CARD_POINT);
}

export default angular.module('le.groupCard.point', [])
.config(memberInfoRouter)
	.name;
