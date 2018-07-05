/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-06-07
 * time line component
 * @usage <ccms-time-line state-list="Array" currentState="index"></ccms-time-line>
 */

import angular from 'angular';

import './_style.scss';
import template from './template.tpl.html';
import controller from './controller';

const componentSetting = {
	template,
	bindings: {
		type: '@',
		symbol: '@',
		currentState: '<',
		stateList: '<'
	},
	controller
};

export default angular.module('le.components.timeLine', [])
	.component('leTimeLine', componentSetting)
	.name;
