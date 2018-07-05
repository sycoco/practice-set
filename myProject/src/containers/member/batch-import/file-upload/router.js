/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-20
 */

import userTplUrl from './file-upload.html';
import UserRoleCtrl from './FileUploadCtrl';

export default {

	FILE_UPLOAD: {
		url: '/file-upload/:importId',
		templateUrl: userTplUrl,
		controller: UserRoleCtrl,
		controllerAs: '$ctrl'
	}

};
