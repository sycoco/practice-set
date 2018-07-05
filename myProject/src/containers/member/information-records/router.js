/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-20
 */

import userTplUrl from '../member-main.html';
import UserRoleCtrl from './InfomationRecords';

export default {

	INFORMATION_RECORD: {
		url: '/information-records',
		templateUrl: userTplUrl,
		controller: UserRoleCtrl,
		controllerAs: '$ctrl'
	}

};
