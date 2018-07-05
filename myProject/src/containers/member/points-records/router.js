/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-20
 */

import userTplUrl from '../member-main.html';
import UserRoleCtrl from './PointsRecords';

export default {

	POINTS_RECORDS: {
		url: '/points-records',
		templateUrl: userTplUrl,
		controller: UserRoleCtrl,
		controllerAs: '$ctrl'
	}

};
