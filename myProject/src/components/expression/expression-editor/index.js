/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */

import angular from 'angular';

import './_expression-editor.scss';
import template from './expression-editor.tpl.html';
import controller from './ExpressionEditorCtrl.js';

const ddo = {
	template,
	controller,
	bindings: {
		editable: '<',
		expression: '<',
		variables: '<',
		getRange: '&',
		setRange: '&',
		setExpression: '&',
		setValidation: '&',
		errorTips: '=?'
	}
};

export default angular.module('le.components.expressionEditor', [])
	.component('leExpressionEditor', ddo)
	.name;
