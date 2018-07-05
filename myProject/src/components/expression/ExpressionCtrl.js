/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-10-10 09:50
 */

import angular from 'angular';
import { Inject } from 'angular-es-utils';
import { Throttle } from 'angular-es-utils/decorators';

import * as ExpressionVariable from '../../common/Services/ExpressionConst.js';
import ExpressionService from '../../common/Services/ExpressionService.js';

@Inject('$element', '$scope')
export default class ExpressionCtrl {
	hoverVariableClassName = '';
	VARIABLE_NAME_PREFIX = ExpressionVariable.VARIABLE_NAME_PREFIX;
	SPLIT_SYMBOL = ExpressionVariable.SPLIT_SYMBOL;
	_range = null;
	_expressionValidation = false;

	constructor() {
		this.mouseClickHandler = this.mouseClickHandler.bind(this);
		this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
		this.isChrome = window.navigator.userAgent.indexOf('Chrome') > -1;
	}
	jumpToBaiDu() {
		window.open('https://www.baidu.com/s?ie=UTF-8&wd=Chrome');
	}

	$onInit() {
		this._$scope.$on('insertContent', (e, content) => this.insertHTMLElement(ExpressionService.generateContentElement(content)));
	}

	/**
	 * Event delegation
	 * Handle mouse click on the expression block
	 * When click the variable label, the editCustomVariableFn will be fired.
	 * @param {object} event
	 */
	@Throttle(100)
	mouseClickHandler(event) {
		const className = event.target.className;
		if (ExpressionVariable.VARIABLE_ITEM_REGEXP.test(className)) {
			// get target item name
			const result = ExpressionVariable.VARIABLE_NAME_PREFIX_REGEXP.exec(event.target.className) || [];
			const targetClassName = result[0];
			const [typeName, id] = targetClassName.replace(ExpressionVariable.VARIABLE_NAME_PREFIX, '').split(ExpressionVariable.SPLIT_SYMBOL);
			// distinguish system || custom variable
			if (typeName !== 'custom') return;
			let ary = [];
			(this.variables.filter(variable => variable.name === 'custom').map(item => item.variables)).forEach(item => {
				ary = ary.concat(item);
			});
			const variable = ary && ary.filter(variable => (variable.id + '') === id)[0];
			this.editCustomVariableFn && variable && this.editCustomVariableFn({variable, currentSchemaId: variable.currentSchemaId, categoryName: variable.categoryName});
		}
	}

	/**
	 * Event delegation
	 * Handle mouse move on the expression block
	 * When mouse moves on the label, the same label in the block should be active.
	 * @param {object} event
	 */
	@Throttle(50)
	mouseMoveHandler(event) {
		const className = event.target.className;
		if (ExpressionVariable.VARIABLE_ITEM_REGEXP.test(className)) {
			// get target item name
			const result = ExpressionVariable.VARIABLE_NAME_PREFIX_REGEXP.exec(className) || [];
			// hover on variable item
			const targetClassName = result[0];
			// hover on the same variable item
			if (targetClassName === this.hoverVariableClassName) return;
			this.clearAllActiveVariableItem();
			this.addActiveVariableItem(targetClassName);
			this.hoverVariableClassName = targetClassName;
		} else if (this.hoverVariableClassName) {
			// mouse move away from hover item
			this.clearAllActiveVariableItem();
			this.hoverVariableClassName = '';
		}
	}

	addActiveVariableItem(targetClassName) {
		document.querySelectorAll(`.${ExpressionVariable.VARIABLE_ITEM_CLASS_NAME}.${targetClassName}`)
			.forEach(element => angular.element(element).addClass(ExpressionVariable.VARIABLE_ITEM_ACTIVE_CLASS_NAME));
	}

	clearAllActiveVariableItem() {
		document.querySelectorAll('.' + ExpressionVariable.VARIABLE_ITEM_CLASS_NAME)
			.forEach(element => angular.element(element).removeClass(ExpressionVariable.VARIABLE_ITEM_ACTIVE_CLASS_NAME));
	}

	initRange() {
		const ele = this._$element[0].querySelector('.expression-editor');
		if (ele) {
			ele.focus();
			const range = document.createRange();
			range.selectNodeContents(ele);
			range.collapse(false);
			this._range = range;
		} else {
			this._range = null;
		}
	}

	/**
	 * update select range of expression
	 */
	getRange() {
		const selObj = window.getSelection();
		return selObj.getRangeAt(0);
	}

	/**
	 * set current select range of expression
	 * @param {object} range
	 */
	setRange(range) {
		this._range = range;
	}

	setExpression(expression, index = 0) {
		this.rules[index].exprContent = expression.toUpperCase();
	}

	setValidation(validation, index = 0) {
		this.rules[index].cheked = validation;
		this._expressionValidation = this.rules.every(rule => rule.cheked);
	}

	/**
	 * 根据存储的光标信息，定位光标
	 */
	setPointerPosition() {
		!this._range && this.initRange();

		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(this._range);
	}

	/**
	 * 往富文本编辑器中插入标签
	 */
	insertHTMLElement(element) {
		this.setPointerPosition();
		document.execCommand('insertHTML', false, element);
		this._$scope.$broadcast('editExpression');
	}
	clickTheSwitch(rule, open) {
		this.clickTheSwitchFn({rule, open});
	}

	sendTimeTitle(rule) {
		let sendTime = (rule.ruleContentConfig && rule.ruleContentConfig.sendTime) || {period: 0};
		let temp = '买家确认收货后';
		const timeUnit = {
			YEAR: '年',
			MONTH: '个月',
			WEEK: '周',
			DAY: '天',
			HOUR: '小时'
		};
		temp = temp + ((sendTime.period === 0) ? '立即发送' : ('第' + sendTime.period + timeUnit[sendTime.unit]));
		return temp;
	}
	conEditCustomVariableFn(obj) {
		console.log(obj);
	}
}
