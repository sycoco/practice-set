/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import './_points-rules.scss';
import DataManage from '../../../common/DataManage';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	DataManage.$STATEPROVIDER_POINTSRULES = $stateProvider;
}

export default angular.module('le.loyalty.pointsRules', [])
	.config(memberInfoRouter)
	.name;
