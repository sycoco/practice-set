/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import expressionEditor from './expression-editor';
import './_expression.scss';
import template from './expression.tpl.html';
import controller from './ExpressionCtrl.js';

const ddo = {
	template,
	controller,
	bindings: {
		rules: '<',
		variables: '<',
		editable: '<?',
		editCustomVariableFn: '&?',
		editExpressionIcon: '<?',
		editExpressionFn: '&?',
		hasFooter: '<?',
		customVariablesAry: '<?',
		clickTheSwitchFn: '&?'
	}
};

export default angular.module('le.components.expression', [expressionEditor])
	.component('leExpressionBlock', ddo)
	.name;
