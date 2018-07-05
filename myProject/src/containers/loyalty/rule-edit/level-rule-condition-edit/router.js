/**
 * @author wenjie.li
 * @since 2016-10-12
 */

import ctrlUrl from '../ConditionTpl.html';
import ctrl from './RuleConditionEditCtrl';

export default {

	RULE_CONDITION_EDIT: {
		url: '/leve-rules/levelruleConditionEdit/',
		templateUrl: ctrlUrl,
		controller: ctrl,
		controllerAs: '$ctrl'
	}

};
