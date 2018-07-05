/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import Router from './router';

import './_infomation.scss';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	$stateProvider.state('le.member.information', Router.INFORMATION);
	$stateProvider.state('le.member.informationPointsRecords', Router.INFORMATION_POINTS_RECORDS);
}

export default angular.module('le.member.information', [])
	.config(memberInfoRouter)
	.name;
