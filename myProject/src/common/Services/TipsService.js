/**
 * Created by liwenjie on 2016/12/7.
 */

import {Inject} from 'angular-es-utils';

@Inject('$ccTips', '$timeout')
export default class TipsService {
	constructor() {
		this.tip = {};
		this.showError = this._showError.bind(this);
		this.showSuccess = this._showSuccess.bind(this);
		this.closeAll = this._closeAll.bind(this);
	}
	_showError(str, modle, notNeedCheck) {
		if (!this.tip[str] || !this.tip[str].element || !this.tip[str].element.clientWidth || notNeedCheck) {
			let modleEle = modle ? document.querySelector('.modal-body') : undefined;
			this.tip[str] = this._$ccTips.error(str, modleEle);
			this.tip[str + 'timer'] && this._$timeout.cancel(this.tip[str + 'timer']);
			this.tip[str + 'timer'] = this.closeTip(str);
			return this.tip[str];
		}
	}

	closeTip(str) {
		return this._$timeout(() => {
			this._close(str);
		}, 8000); // 默认八秒钟后自动消失
	}

	_showSuccess(str) {
		return this._$ccTips.success(str);
	}
	_closeAll() {
		for (let key in this.tip) {
			this._close(key);
		}
	}
	_close(str) {
		this.tip[str] && this.tip[str].element && this.tip[str].element.clientWidth && this.tip[str].close();
	}
}

