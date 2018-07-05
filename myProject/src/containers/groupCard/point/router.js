/**
 * Created by liwenjie on 2016/12/15.
 */

import tpl from '../../../containers/member/member-main.html';
import ctrl from './GroupCardPoint';

export default {

	GROUP_CARD_POINT: {
		url: '/groupCard/point',
		templateUrl: tpl,
		controller: ctrl,
		controllerAs: '$ctrl'
	}

};
