/**
 * Created by liwenjie on 2016/12/23.
 */

import angular from 'angular';
import { Inject } from 'angular-es-utils';

import * as ExpressionVariable from '../../common/Services/ExpressionConst.js';

@Inject('$rootScope')
export default class ExpressionCtrl {
	constructor() {

	}
	addActiveVariableItem(variable, name) {
		document.querySelectorAll(`.${ExpressionVariable.VARIABLE_ITEM_CLASS_NAME}.variable__${name}_-_-_${variable.id}`)
		.forEach(element => angular.element(element).addClass(ExpressionVariable.VARIABLE_ITEM_ACTIVE_CLASS_NAME));
	}

	clearAllActiveVariableItem() {
		document.querySelectorAll('.' + ExpressionVariable.VARIABLE_ITEM_CLASS_NAME)
		.forEach(element => angular.element(element).removeClass(ExpressionVariable.VARIABLE_ITEM_ACTIVE_CLASS_NAME));
	}
	// insertExpressionContent(conent) {
	// 	this._$rootScope.$broadcast('insertContent', conent);
	// }
}
