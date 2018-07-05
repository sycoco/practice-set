/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-20
 */

import userTplUrl from './batch-import.html';
import UserRoleCtrl from './BatchImportCtrl';

export default {

	BATCH_IMPORT: {
		url: '/batch-import',
		templateUrl: userTplUrl,
		controller: UserRoleCtrl,
		controllerAs: '$ctrl'
	}

};
