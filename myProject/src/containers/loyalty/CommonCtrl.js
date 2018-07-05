/**
 * Created by liwenjie on 2016/11/9.
 */

// import {Inject} from 'angular-es-utils';
import DataManage from '../../common/DataManage';

// @Inject('$ccMenus')
export default class CommonCtrl {

	constructor() {
		DataManage.setDataInfo(this, 'currentCtrl');
		this._$scope.$on('$destroy', () => {
			DataManage.currentCtrl = null;
		});
	}

	initConfigInfo() {
	}
}
