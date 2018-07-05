/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import Router from './router';

import './_batch-import.scss';

batchImportRouter.$inject = ['$stateProvider'];
function batchImportRouter($stateProvider) {
	$stateProvider.state('le.member.batchImport', Router.BATCH_IMPORT);
}

export default angular.module('le.member.batchImport', [])
	.config(batchImportRouter)
	.name;
