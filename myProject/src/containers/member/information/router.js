/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-20
 */

import informationUrl from '../member-main.html';
import InformationCtrl from './InformationCtrl';

import userTplUrl from '../member-main.html';
import UserRoleCtrl from '../points-records/PointsRecords';

export default {

	INFORMATION: {
		url: '/information',
		templateUrl: informationUrl,
		controller: InformationCtrl,
		controllerAs: '$ctrl'
	},
	INFORMATION_POINTS_RECORDS: {
		url: '/information/pointRecord',
		templateUrl: userTplUrl,
		controller: UserRoleCtrl,
		controllerAs: '$ctrl',
		params: {
			member: null
		}
	}
};
