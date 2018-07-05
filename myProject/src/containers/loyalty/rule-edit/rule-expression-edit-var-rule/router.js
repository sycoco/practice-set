/**
 * @author wenjie.li
 * @since 2016-10-12
 */

import customVarTplUrl from './rule-expression-edit.html';
import CustomVarCtrl from './RuleExpressionEditCtrl';

export default {

	RULE_EXPRESSION_EDIT: {
		url: '/ruleExpressionEditVarRule/:varId',
		params: {
			rule: null,
			variable_condition: null
		},
		templateUrl: customVarTplUrl,
		controller: CustomVarCtrl,
		controllerAs: '$ctrl'
	}

};
