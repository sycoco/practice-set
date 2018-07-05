/**
 * Created by liwenjie on 2016/12/15.
 */

import angular from 'angular';
import point from './point';
import setting from './setting';
import Router from './router';
import GroupCardService from './services';

loyaltyRouter.$inject = ['$stateProvider'];
function loyaltyRouter($stateProvider) {
	$stateProvider.state('le.groupCard', Router.GROUP_CARD);
}

export default angular.module('ccms.le.groupCard', [point, setting])
.config(loyaltyRouter)
.service('GroupCardService', GroupCardService)
	.name;
