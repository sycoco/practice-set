/**
 * Created by liwenjie on 2016/12/17.
 */

import { Inject } from 'angular-es-utils';
import DataManage from '../../../../common/DataManage';

@Inject('$q', '$ccValidator', 'modalInstance', 'TipsService')
export default class UpdateInfoCtrl {

	constructor() {
		console.log(this.shopList);
	}

	ok() {
		let selected = this.shopList.filter(item => item.selected);
		console.log('selected');
		console.log(selected);
		this._modalInstance.ok(selected);
	}
	clickItem(item) {
		!item.disable && (item.selected = !item.selected);
		if (item.disable) {
			this._TipsService.showError(`该${DataManage.allConfig.unitViewCaption || '店铺'}已参与集团卡：` + item.hasBindCardCaption, true, true);
		}
	}
}
