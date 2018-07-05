/**
 * Created by liwenjie on 2016/12/23.
 */

import angular from 'angular';

import './_style.scss';
import template from './expression-btn.tpl.html';
import controller from './ExpressionBtnCtrl';

const ddo = {
	template,
	controller,
	bindings: {
		contents: '=',
		currentSchemaId: '=?',
		insertExpressionContent: '&?'
	}
};

export default angular.module('le.components.leExpressionBtn', [])
.component('leExpressionBtn', ddo)
	.name;
