/**
 * Created by liwenjie on 2016/12/1.
 */

import angular from 'angular';

import './_style.scss';
import template from './template.tpl.html';
import controller from './controller';

const componentSetting = {
	template,
	bindings: {
		timeConfigObj: '=',
		simple: '@'
	},
	controller
};
export default angular.module('le.components.validitySeting', [])
.component('validitySetting', componentSetting)
	.name;
