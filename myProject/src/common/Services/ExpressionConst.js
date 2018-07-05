/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-10-20 17:41
 */

export const SPLIT_SYMBOL = '_-_-_';
export const VARIABLE_ITEM_CLASS_NAME = 'variable-item';
export const VARIABLE_ITEM_ACTIVE_CLASS_NAME = 'variable-item--active';
export const VARIABLE_ITEM_REGEXP = new RegExp(VARIABLE_ITEM_CLASS_NAME);
export const VARIABLE_NAME_PREFIX = 'variable__';
export const VARIABLE_NAME_PREFIX_REGEXP = new RegExp(`${VARIABLE_NAME_PREFIX}\\S+`);
export const TEXT_ELEMENT_REGEXP = new RegExp('<span class="ng-scope">(.*?)<\/span>', 'g');
export const INPUT_ELEMENT_REGEXP = new RegExp(`<input.*?${VARIABLE_NAME_PREFIX}([^\\s"]*)[^>]+>`, 'g');

export const SYSTEM_VARIABLE_REG = /\[(\-?\d+)]/g;
export const SYSTEM_VARIABLE_ONLY_REG = /^\[(\-?\d+)]$/g;
export const CUSTOM_VARIABLE_REG = /\{(\-?\d+)}/g;
export const CUSTOM_VARIABLE_ONLY_REG = /^\{(\-?\d+)}$/g;
export const OPERATORS_REG = /[\+\-\*\(\)](?!\d+[}\]])/g;

export const VALIDATOR_DECIMAL = /^\d+(\.\d+)?$/;
export const VALIDATOR_OPERATOR_START = /^[\+\-\*]+/;
export const VALIDATOR_OPERATOR_END = /[\+\-\*]+$/;
export const VALIDATOR_NO_OPERATOR = /[\]\}\d]+SUM+/;
export const VALIDATOR_DOUBLE_OPERATOR = /[\+\-\*]{2,}/g;
export const VALIDATOR_BLANK_BRACKET = /\(\)/g;
export const VALIDATOR_OPERATOR_BESIDES_LEFT_BRACKET = /\([\+\-\*]+/g;
export const VALIDATOR_OPERATOR_BESIDES_RIGHT_BRACKET = /[\+\-\*]+\)/g;

export const VALIDATOR_DOUBLE_COMMA = /[,]+\)/g;

export const OPERATORS = [
	{
		name: '+',
		caption: '+',
		type: 'operator'
	},
	{
		name: '-',
		caption: '-',
		type: 'operator'
	},
	{
		name: '*',
		caption: '*',
		type: 'operator'
	},
	/* {
		name: '/',
		caption: '/',
		type: 'operator'
	},*/
	{
		name: '( )',
		caption: '( )',
		type: 'operator'
	}
];

export const generateMethodReg = methodsName =>
	new RegExp(methodsName
		.map(name => `(${name})`)
		.join('|'), 'g');
