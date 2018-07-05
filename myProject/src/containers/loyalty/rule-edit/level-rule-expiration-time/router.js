/**
 * Created by liwenjie on 2016/11/15.
 */

import ctrlUrl from './level-rule-expiration-Time.html';
import ctrl from './LevelRuleExpirationTimeCtrl';

export default {

	RULE_CONDITION_EDIT: {
		url: '/levelRuleExpirationEdit',
		params: {
			editingLevelRule_condition: null
		},
		templateUrl: ctrlUrl,
		controller: ctrl,
		controllerAs: '$ctrl'
	}

};
