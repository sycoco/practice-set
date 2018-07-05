/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import Router from './router';

import './_points-records.scss';

userRoleRouter.$inject = ['$stateProvider'];
function userRoleRouter($stateProvider) {
	$stateProvider.state('le.member.pointsRecords', Router.POINTS_RECORDS);
}

export default angular.module('le.member.pointsRecords', [])
	.config(userRoleRouter)
	.name;
