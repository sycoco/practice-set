/**
 * Created by liwenjie on 2017/2/22.
 */

import angular from 'angular';
import './_style.scss';
import tplUrl from './home.html';
import ctrl from './home';

homeRouter.$inject = ['$stateProvider', '$urlRouterProvider'];
function homeRouter($stateProvider, $urlRouterProvider) {
	$stateProvider.state('le.home', {
		url: '/home',
		templateUrl: tplUrl,
		controller: ctrl,
		controllerAs: '$ctrl'
	});
	$urlRouterProvider.otherwise('/le');
}

export default angular.module('ccms.le.home', [])
.config(homeRouter)
	.name;

