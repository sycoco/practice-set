/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-10-10 15:13
 */

import * as ExpressionConst from './ExpressionConst.js';
import ExpressionValidateService from './ExpressionValidateService.js';

class ExpressionService {
	/**
	 * Generate content html element.
	 * @param {object} content
	 */
	generateContentElement = (content = {}) => {
		let width = (content.caption.replace(/[\u4e00-\u9fa5]/g, '**')).length + 1;
		switch (content.type) {
			case 'method':
				return `<input
		      value="${content.caption}"
					style="width: ${width}ch"
					class="${ExpressionConst.VARIABLE_NAME_PREFIX}${content.type}${ExpressionConst.SPLIT_SYMBOL}${content.name}"
		      disabled>()`;
			case 'system':
			case 'custom':
				return `<input
		      value="${content.caption}"
					style="width: ${width}ch"
					class="variable-item ${ExpressionConst.VARIABLE_NAME_PREFIX}${content.type}${ExpressionConst.SPLIT_SYMBOL}${content.id}"
		      disabled>`;
			case 'text':
			case 'operator':
			default:
				return content.caption;
		}
	};

	/**
	 * Format expression to html string.
	 * @param {string} expression
	 * @param {Array} variables
	 * @param {boolean} withInput
	 */
	htmlExpression = (expression = '', variables = [], withInput = false) =>
		variables
			.concat()
			.sort((prev, curr) => prev.priority > curr.priority) // high priority operator should be replace first.
			.reduce((expression, variable) =>
				expression.replace(variable.variableReg, (str, id) => {
					let variableItem;
					switch (variable.name) {
						case 'system':
						case 'custom':
							variableItem = variable.variables.find(v => v.id + '' === id);
							return variableItem
								? withInput
									? this.generateContentElement(variableItem)
									: variableItem.caption
								: str;
						default:
							variableItem = variable.variables.find(v => v.caption === str);
							return variableItem
								? withInput
									? this.generateContentElement(variableItem)
									: variableItem.caption
								: str;
					}
				}), expression);

	/**
	 * Parse expression from html to string
	 */
	parseExpression = (html = '', variables = []) =>
		html
			.replace(/&nbsp;/g, '')
			.replace(/<br>/g, '')
			.replace(/（/g, '(')
			.replace(/）/g, ')')
			.replace(/，/g, ',')
			.replace(ExpressionConst.TEXT_ELEMENT_REGEXP, '$1')
			.replace(ExpressionConst.INPUT_ELEMENT_REGEXP, (input, string) => {
				const [typeName, value] = string.split(ExpressionConst.SPLIT_SYMBOL);
				const typeObject = variables.filter(type => type.name === typeName);
				if (!typeObject) return input;
				let allVariables = [];
				if (typeObject.length === 1) {
					allVariables = typeObject[0].variables;
				} else {
					allVariables = typeObject.reduce((a, b) => a.variables.concat(b.variables));
				}
				const variableObj = allVariables.find(obj => (obj.id + '') === value);
				switch (typeName) {
					case 'system':
						return `[${variableObj ? variableObj.id : ''}]`;
					case 'custom':
						return `{${variableObj ? variableObj.id : ''}}`;
					default:
						return value;
				}
			})
			.replace(/\s/g, '');

	validateExpressionHTML = (html = '', variables = []) => {
		html = html
		.replace(/&nbsp;/g, '')
		.replace(/<br>/g, '')
		.replace(/（/, '(')
		.replace(/）/, ')')
		.replace(/，/, ',');
		// 包含操作符或变量
		const expression = this.parseExpression(html, variables);
		if (~expression.indexOf('class')) { return {bool: true}; }
		return ExpressionValidateService.validateExpression(expression, this.getMethodsName(variables));
	};

	clearSpace = text => text.replace('&nbsp;', '').replace(/\s/g, '');

	logValidateErrorReason = (message, epression, source) => {
		console.info(message, epression, source);
	};

	getMethodsName = variables =>
		variables
			.filter(variable => variable.type === 'method')
			.reduce((prev, curr) => prev.concat(curr.variables.map(item => item.name)), []);

	/**
	 * @param {string} attr
	 * @param {string} value
	 * @param {Array} array
	 * @returns {*|null}
	 */
	getObjectInArray = (attr, value, array) => {
		return array.filter(item => item[attr] === value)[0] || null;
	}
}

export default new ExpressionService();
