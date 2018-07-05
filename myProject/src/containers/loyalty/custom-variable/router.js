/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-20
 */

import customVarTplUrl from './custom-variable.html';
import CustomVarCtrl from './CustomVarCtrl';

export default {

	CUSTOM_VAR: {
		url: '/custom-var/:varId',
		templateUrl: customVarTplUrl,
		controller: CustomVarCtrl,
		controllerAs: '$ctrl'
	}

};
