/**
 * @author wenjie.li
 * @since 2016-10-12
 */

import ctrlUrl from '../ConditionTpl.html';
import ctrl from './RuleConditionEditCtrl';

export default {

	RULE_CONDITION_EDIT: {
		url: '/ruleConditionEdit/:varId',
		params: {
			rule: null,
			index: null
		},
		templateUrl: ctrlUrl,
		controller: ctrl,
		controllerAs: '$ctrl'
	}

};
