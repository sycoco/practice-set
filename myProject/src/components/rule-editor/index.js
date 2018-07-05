/**
 * @author 李文杰
 * @since 2016-10-10
 * @usage <le-rule-editor rule-list="$ctrl.rules"></le-rule-editor>
 */

import angular from 'angular';
import './_style.scss';
import template from './template.tpl.html';
import ruleEditorController from './controller.js';


const ddo = {
	template,
	controller: ruleEditorController,
	bindings: {
		ruleList: '=',
		editClick: '&?'
	}
};

export default angular.module('le.components.ruleEditor', [])
	.component('leRuleEditor', ddo)
	.name;
