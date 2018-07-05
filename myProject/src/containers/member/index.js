/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-27
 */

import angular from 'angular';

import memberInfoModule from './information';
import memberInfoRecordsModule from './information-records';
import memberLevelRecordsModule from './level-records';
import memberPointsRecordsModule from './points-records';
import memberBatchImportModule from './batch-import';
import memberFileUploadModule from './batch-import/file-upload';

import Router from './router';
import './_member.scss';

import MemberServices from './service';

memberRouter.$inject = ['$stateProvider'];
function memberRouter($stateProvider) {
	$stateProvider.state('le.member', Router.MEMBER);
}

export default angular.module('ccms.le.member', [memberInfoModule, memberInfoRecordsModule, memberLevelRecordsModule, memberPointsRecordsModule, memberBatchImportModule, memberFileUploadModule])
	.config(memberRouter)
	.service('MemberServices', MemberServices)
	.name;
