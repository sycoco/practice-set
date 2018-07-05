/**
 * Created by liwenjie on 2016/10/13.
 */

import angular from 'angular';
import './_style.scss';
import template from './template.tpl.html';
import controller from './controller.js';


const config = {
	template,
	controller,
	transclude: true,
	bindings: {
		titleName: '@',
		expand: '=?'
	}
};

export default angular.module('le.components.foldingBarContainer', [])
.component('leFoldingBarContainer', config)
	.name;
