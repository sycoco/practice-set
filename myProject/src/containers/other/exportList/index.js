/**
 * Created by liwenjie on 2017/3/3.
 */

import angular from 'angular';
import './_style.scss';
import tplUrl from './exportListTpl.html';
import ctrl from './exportListController';

homeRouter.$inject = ['$stateProvider'];
function homeRouter($stateProvider) {
	$stateProvider.state('le.exportList', {
		url: '/exportList',
		templateUrl: tplUrl,
		controller: ctrl,
		controllerAs: '$ctrl'
	});
}

export default angular.module('ccms.le.exportList', [])
.config(homeRouter)
	.name;
