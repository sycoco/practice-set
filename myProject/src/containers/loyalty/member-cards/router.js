/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-20
 */

import userTplUrl from './member-cards.html';
import UserRoleCtrl from './MemberCards';

export default {

	MEMBER_CARDS: {
		url: '/memberCards',
		templateUrl: userTplUrl,
		controller: UserRoleCtrl,
		controllerAs: '$ctrl'
	}

};
