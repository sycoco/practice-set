/**
 * Created by liwenjie on 2016/12/17.
 */

import { Inject } from 'angular-es-utils';
// import Resource from '../../../../common/Resources.js';

@Inject('$q', '$ccValidator', 'modalInstance', 'TipsService')
export default class ChoiceShopCtrl {

	constructor() {
		console.log(this.shopList);
	}

	ok() {
		let selected = this.shopList.filter(item => item.selected);
		this._modalInstance.ok(selected);
	}
	clickItem(item) {
		this.shopList.forEach(item => {
			item.selected = false;
		});
		item.selected = true;
	}
}
