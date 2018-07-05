/**
 * Created by liwenjie on 2016/11/1.
 */


import angular from 'angular';

import './_style.scss';
import template from './template.tpl.html';
import controller from './Controller';

const componentSetting = {
	template,
	bindings: {
		time: '=',
		prefix: '@?',
		show: '=?',
		close: '&?'
	},
	controller
};

export default angular.module('le.components.timeInput', [])
.component('leTimeInput', componentSetting)
	.name;
