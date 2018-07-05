/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-10-20 10:47
 */

// import * as ExpressionConst from './ExpressionConst.js';

const EXPRESSION_REGEXP = [
	{reg: /(]|})(\[|\{)/g, number: 1, error: '变量 连续出现了'},
	{reg: /(\)[a-zA-Z]+)/g, number: 2, error: '函数 前没有操作符'},
	{reg: /(\)\()/g, number: 3, error: '两个括号之间没有操作符'},
	{reg: /(\d|\.)+(\[|\{)/g, number: 4, error: '数字 和 变量 之间缺少操作符'},
	{reg: /(]|})(\d|\.)+/g, number: 5, error: '变量块 和 数块 之间缺少操作符'},
	{reg: /(\d|\.)+[a-zA-Z]+/g, number: 6, error: '数字 和 函数 之间缺少操作符'},
	{reg: /[a-zA-Z]+(\d|\.)+/g, number: 7, error: '函数 和 数字 之间缺少操作符'},
	{reg: /(\d|\.)+(\()/g, number: 8, error: '数字 和 括号 之间缺少操作符'},
	{reg: /(\))(\d|\.)+/g, number: 9, error: '括号 和 数字 之间 缺少操作符'},
	{reg: /(]|})[a-zA-Z]+/g, number: 10, error: '变量 和 函数 之间缺少操作符'},
	// {reg: /\)(\[|\{)/g, number: 1, error: '11 函数 和 变量 之间缺少操作符'},
	{reg: /(]|})\(/g, number: 10, error: '变量 和 括号 之间缺少操作符'},
	{reg: /\)(\[|\{)/g, number: 11, error: '括号 和 括号 之间缺少操作符'},
	{reg: /\)([a-zA-Z]+)/g, number: 12, error: '函数 和 括号 之间缺少操作符'},
	{reg: /(\+|\*|,){2,}/g, number: 13, error: '操作符 连续出现了'},
	{reg: /-{2,}/g, number: 14, error: '操作符 连续出现了'},
	{reg: /((\+|\*|,)-)|(-(\+|\*|,))/g, number: 15, error: '操作符 连续出现了'},
	{reg: /(\+|-|\*|,)$/g, number: 16, error: '不能以操作符作为结尾'},
	{reg: /\((\+|\*|,)/g, number: 17, error: '操作符的左边缺少元素'},
	{reg: /(\+|\*|,|-)\)/g, number: 18, error: '操作符的右边缺少元素'},
	{reg: /\(,/g, number: 19, error: '括号内的,的位置错误'},
	{reg: /,\)/g, number: 20, error: '括号内的,的位置错误'},
	{reg: /^(\+|\*|,)/g, number: 21, error: '不能以操作符作为开头'},
	{reg: /\(\)/g, number: 22, error: '()没有任何数值'},
	{reg: /^$/g, number: 23, error: '表达式为空'},
	{reg: /[a-zA-Z]+(\+|\*|,|-|\))/g, number: 24, error: '函数必须紧跟左括号而不是其他'},
	{reg: /[`~!@#$%^&?\/\\';:"=]/g, number: 26, error: '含有非法字符'},
	{reg: /[^\d]+\./g, number: 28, error: '小数点左边不是数字'},
	{reg: /^\./g, number: 28, error: '不能以小数点作为开头'},
	{reg: /\.[^\d]+/g, number: 29, error: '小数点右边不是数字'},
	{reg: /\.$/g, number: 29, error: '不能以小数点作为结尾'},
	{reg: /\.\d\./g, number: 29, error: '多余的小数点导致的数字错误'},
	{reg: /[a-zA-Z]+$/g, number: 30, error: '最后一个函数缺少括号'}];
class ExpressionValidateService {

	validateExpression = (expression = '', methodsName = []) => {
		return this.check_expression(expression, methodsName);
	};

	check_expression = (text, methodsName) => {
		if (text === '') {
			return false;
		}
		let errorIndexArry = [];
		EXPRESSION_REGEXP.forEach(regItem => {
			while (true) {
				let result = regItem.reg.exec(text);
				if (!result) break;
				errorIndexArry.push({index: result.index, match: result[0], reason: regItem.error});
			}

		});
		errorIndexArry = errorIndexArry.concat(this.check_bracket_is_error_number(text));
		errorIndexArry = errorIndexArry.concat(this.check_comma_is_error_location(text));
		errorIndexArry = errorIndexArry.concat(this.check_methodsName(text, methodsName));
		errorIndexArry = errorIndexArry.concat(this.check_ZH(text));
		if (!(/^[a-zA-Z()\[\]\{\}\.\d+-\\*]+$/g.test(text))) {
			errorIndexArry.push({reason: '含有非法字符'});
		}
		if (errorIndexArry.length !== 0) {
			console.log('校验失败\t' + text);
			console.log(`一共有${errorIndexArry.length}个错误失败原因\r`);
			errorIndexArry.forEach(item => {
				this.writeObj(item);
			});
			errorIndexArry.tip = (() => {
				return errorIndexArry.map((item, index) => ('第' + (index + 1) + '个错误: ' + ((item.match && (item.match + ' \t')) || '') + '原因:' + item.reason)).join('\t\n');
			})();
			return {bool: false, errorTips: errorIndexArry};
		} else {
			console.log('校验成功\t' + text);
			return {bool: true};
		}
	};

	writeObj = obj => {
		var description = '';
		for (var i in obj) {
			var property = obj[i];
			description += i + ' = ' + property + '\n';
		}
		console.info(description);
	};
	check_methodsName = (expression = '', methodsName) => {
		let matchArry = [];
		let error = [];
		let r = /[a-zA-Z]+/g;
		while (true) {
			var match = r.exec(expression);
			if (!match) break;
			matchArry.push(match[0]);
		}
		matchArry = matchArry.map(item => item.toUpperCase());
		let R = new RegExp('^' + methodsName.join('|') + '$');
		matchArry.forEach(abc => {
			if (!R.test(abc)) {
				error.push({match: abc, reason: abc + '是非法的函数'});
			}
		});
		return error;
	};
	check_ZH = expression => {
		let matchArry = [];
		let r = /[\u4e00-\u9fa5]+/g;
		while (true) {
			var match = r.exec(expression);
			if (!match) break;
			matchArry.push(match[0]);
		}
		matchArry.map(item => {
			return {match: item, reason: item + '是非法的内容'};
		});
		return matchArry;
	};

	check_bracket_is_error_number = (expression = '') => {
		let char = '';
		let bracketStack = 0;
		for (let i = 0; i < expression.length; i++) {
			char = expression[i];
			if (char === '(' || char === '（') bracketStack++;
			if (char === ')' || char === '）') {
				if (bracketStack === 0) return [{index: i, reason: '括号()匹配错误'}];
				bracketStack--;
			}
		}
		return bracketStack === 0 ? [] : [{index: expression.length, reason: '最后一个括号'}];
	};
	check_comma_is_error_location = (expression = '') => {
		let r = /,/g;
		let indexs = [];
		while (true) {
			var match = r.exec(expression);
			if (!match) break;
			indexs.push(match.index);
		}
		console.log('所有,的位置');
		console.log(indexs);
		let e = [];
		indexs.forEach((index, i) => {
			let firstChar = this.findFist(expression, index);
			if (firstChar === false || !/[a-zA-Z]/.test(firstChar)) {
				e.push({index: index, i: i});
			}
		});
		return e.map(item => {
			return {index: item.index, reason: `第${item.i + 1}个[逗号,]不在函数内`};
		});
	};

	findFist = (expression, index) => {
		let char = '';
		let bracketStack = 0;
		for (let i = index - 1; i >= 0; i--) {
			char = expression[i];
			if (char === ')') bracketStack++;
			if (char === '(') {
				if (bracketStack === 0) return expression.substr(i - 1, 1);
				bracketStack--;
			}
		}
		return false;
	};
}

export default new ExpressionValidateService();
