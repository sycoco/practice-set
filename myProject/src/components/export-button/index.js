/**
 * Created by liwenjie on 2017/1/20.
 */

import angular from 'angular';

import './_style.scss';
import template from './template.tpl.html';
import controller from './Controller';

const componentSetting = {
	template,
	bindings: {
		state: '='
	},
	controller
};

export default angular.module('le.components.timeInput', [])
.component('leTimeInput', componentSetting)
	.name;
