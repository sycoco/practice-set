/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import Router from './router';

import './_file-upload.scss';

fileUploadRouter.$inject = ['$stateProvider'];
function fileUploadRouter($stateProvider) {
	$stateProvider.state('le.member.fileUpload', Router.FILE_UPLOAD);
}

export default angular.module('le.member.fileUpload', [])
	.config(fileUploadRouter)
	.name;
