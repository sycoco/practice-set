/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

// import Router from './router';

import './_level-rules.scss';

// memberInfoRouter.$inject = ['$stateProvider'];
// function memberInfoRouter($stateProvider) {
// 	$stateProvider.state('le.loyalty.levelRules', Router.LEVEL_RULES);
// }
import DataManage from '../../../common/DataManage';

memberInfoRouter.$inject = ['$stateProvider'];
function memberInfoRouter($stateProvider) {
	DataManage.$STATEPROVIDER_LEVEL = $stateProvider;
}

export default angular.module('le.loyalty.levelRules', [])
	.config(memberInfoRouter)
	.name;
