/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import Router from './router';

import './_level-records.scss';

userRoleRouter.$inject = ['$stateProvider'];
function userRoleRouter($stateProvider) {
	$stateProvider.state('le.member.levelRecords', Router.LEVEL_RECORDS);
}

export default angular.module('le.member.levelRecords', [])
	.config(userRoleRouter)
	.name;
