/**
 * @author wenjie.li
 * @since 2016-10-12
 */

import customVarTplUrl from './rule-expression-edit.html';
import CustomVarCtrl from './RuleExpressionEditCtrl';

export default {

	RULE_EXPRESSION_EDIT: {
		url: '/ruleExpressionEditVarsRule/:id',
		params: {
			rule: null,
			index: null
		},
		templateUrl: customVarTplUrl,
		controller: CustomVarCtrl,
		controllerAs: '$ctrl'
	}

};
