/**
 * Created by liwenjie on 2017/2/22.
 */

import angular from 'angular';
import './_style.scss';
import tplUrl from './config.html';
import ctrl from './config';

homeRouter.$inject = ['$stateProvider'];
function homeRouter($stateProvider) {
	$stateProvider.state('le.config', {
		url: '/config/' + (1 + (1000 - 1) * Math.random()),
		templateUrl: tplUrl,
		controller: ctrl,
		controllerAs: '$ctrl'
	});
}

export default angular.module('ccms.le.config', [])
.config(homeRouter)
	.name;

