/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import Router from './router';

import './_infomation-records.scss';

userRoleRouter.$inject = ['$stateProvider'];
function userRoleRouter($stateProvider) {
	$stateProvider.state('le.member.informationRecords', Router.INFORMATION_RECORD);
}

export default angular.module('le.member.informationRecords', [])
	.config(userRoleRouter)
	.name;
