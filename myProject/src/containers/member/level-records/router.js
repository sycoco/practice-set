/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-20
 */

import userTplUrl from '../member-main.html';
import UserRoleCtrl from './LevelRecords';

export default {

	LEVEL_RECORDS: {
		url: '/level-records',
		templateUrl: userTplUrl,
		controller: UserRoleCtrl,
		controllerAs: '$ctrl'
	}

};
