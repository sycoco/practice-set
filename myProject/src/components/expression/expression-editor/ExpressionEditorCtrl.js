/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-10-10 09:50
 */

import { Inject } from 'angular-es-utils';

import ExpressionService from '../../../common/Services/ExpressionService.js';

@Inject('$scope', '$element', '$timeout')
export default class ExpressionEditorCtrl {
	$onChanges(obj) {
		if (obj.variables && obj.variables.currentValue) {
			this.expressionHTML = ExpressionService.htmlExpression(this.expression, this.variables, true);
			this.validate(this.expressionHTML);
		}
	}

	$onInit() {
		this._$timeout(() => {
			this.validate();
		});
	}
	$postLink() {
		this._$scope.$on('editExpression', this.onChange);
	}

	getExpressionHTML = () => this._$element[0].querySelector('.expression-editor').innerHTML;

	setExpressionLocal() {
		let expression = ExpressionService.parseExpression(this.getExpressionHTML(), this.variables);
		expression = expression.replace(/&nbsp;/g, '')
		.replace(/<br>/g, '')
		.replace(/（/g, '(')
		.replace(/）/g, ')')
		.replace(/，/g, ',');
		this.setExpression({expression});
	}

	validate = html => {
		html = html || this.getExpressionHTML();
		const validation = ExpressionService.validateExpressionHTML(html, this.variables);
		this.errorTips = validation.errorTips;
		this.setValidation({validation: validation.bool});
	};

	// TODO: 可以自动改, 但是光标位置就乱了~ 丁建哲
	/**
	 * update range.
	 */
	onChange = () => {
		const range = this.getRange();
		// this.onblur();
		this.setRange({range});
		this.setExpressionLocal();
		this.validate();
		// this._$timeout(this.onblur());
	};
	//
	// onblur = () => {
	// 	function replace(a, b) {
	// 		document.querySelector('.expression-editor').innerHTML = document.querySelector('.expression-editor').innerHTML.replace(a, b);
	// 	}
	// 	replace('（', '(');
	// 	replace('）', ')');
	// 	replace('，', ',');
	// };

	preventKey = event => {
		if ([9, 17, 18, 219, 221, 13, 186, 191, 192, 220, 222].some(item => item === event.keyCode)) {
			event.preventDefault();
		}
		if (event.keyCode === 13) event.preventDefault();
	};
}
