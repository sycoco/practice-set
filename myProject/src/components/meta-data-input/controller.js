/**
 * Created by liwenjie on 2016/10/19.
 */

import { Inject } from 'angular-es-utils';
import angular from 'angular';

@Inject('$scope', 'goodSelector')
export default class MetaDataInputController {
	$onInit() {
		typeof this.viewType === 'undefined' && (console.warn('le-meta-data-input指令必须要传viewType'));
		this._$scope.$on('checkTheMetaDataInput', (e, content) => this.checkTheMetaDataInput(content));
	}


	constructor() {
		this.logic = this.logic || '';
		this.validatorType = this.validator !== undefined;
		this.basicData();
		this.noFlag = false;
		if (~['FLAG', 'SELECT_MULTI', 'SELECT_MULTI_ANY', 'SELECT_MULTI_CONTAINS'].indexOf(this.viewType)) {
			if (this.values.toString() === '' || this.values.toString() === 'NO') {
				this.noFlag = true;
			} else {
				this.values.forEach(item => {
					this.options.forEach(flag => {
						if (item === flag.value) {
							flag.selected = true;
						}
					});
				});
			}
		}
		this.logicChange();
	}
	set options(newValue) {
		this.optionsTemp = newValue;
		let max = 0;
		if (this.options !== undefined) {
			this.options.forEach(item => {
				max = (item.title || '').length > max ? item.title.length : max;
			});
		}
		this.optionsMax = max;
	}

	get options() {
		return this.optionsTemp;
	}

	basicData() {
		this.numericLogic = [
			{ title: '大于', value: 'GT' },
			{ title: '大于等于', value: 'GE' },
			{ title: '小于', value: 'LT' },
			{ title: '小于等于', value: 'LE' },
			{ title: '介于', value: 'BETWEEN' },
			{ title: '等于', value: 'EQ' },
			{ title: '不等于', value: 'NOTEQ' }
		];
		this.timeLogics = [
			{ title: '晚于', value: 'GT' },
			{ title: '晚于等于', value: 'GE' },
			{ title: '早于', value: 'LT' },
			{ title: '早于等于', value: 'LE' },
			{ title: '介于', value: 'BETWEEN' },
			{ title: '等于', value: 'EQ' },
			{ title: '不等于', value: 'NOTEQ' }
		];
		this.timeLogic = 'LT';
		this.stringLogics = [
			{ title: '包含', value: 'LIKE' },
			{ title: '不包含', value: 'NOTLIKE' },
			{ title: '等于', value: 'EQ' },
			{ title: '不等于', value: 'NOTEQ' }
		];
		this.flagLogic = [
			{ title: '包含', value: 'ANY' },
			{ title: '不包含', value: 'NOTANY' }
		];
		this.selectLogic = [
			{ title: '等于', value: 'EQ' },
			{ title: '不等于', value: 'NOTEQ' }
		];
		this.logicsForContains = [
			{ title: '等于', value: 'CONTAINS' },
			{ title: '不等于', value: 'NOTCONTAINS' }
		];
		this.logicsForAny = [
			{ title: '等于', value: 'ANY' },
			{ title: '不等于', value: 'NOTANY' }
		];

		this.interval = 'GE';
		this.stringLogic = 'LIKE';
		this.flaglogic = 'EQ';
		this.suffixPadding = ((this.suffix || '').length * 12 + 8).toString() + 'px';

		this.years = [];
		for (let i = 1990; i < 2048; i++) {
			this.years.push(
				{ title: `${i}`, value: `${i}` });
		}
		if (this.viewType === 'DATE_UNI_YMD' || this.viewType === 'DATE' || this.viewType === 'DATE_UNI_ALL' || this.viewType === 'DATETIME') {
			if (!Date.parse(this.values && this.values[0]) > 0) {
				// this.values[0] = new Date(new Date().getFullYear(), 0, 1);
			} else {
				this.values[0] = (new Date(this.values[0]));
			}
			if (!Date.parse(this.values && this.values[1]) > 0) {
				// this.values[1] = new Date(new Date().getFullYear(), 11, 31);
			} else {
				this.values[1] = (new Date(this.values[1]));
			}
			this.dateRange = {
				start: this.values[0],
				end: this.values[1],
				minDate: new Date(1900, 1, 1),
				maxDate: new Date(2030, 11, 30),
				// 是否禁用 (false)
				disabled: false,
				// 是否显示时间 (true)
				dateOnly: (this.viewType === 'DATE_UNI_YMD' || this.viewType === 'DATE')
			};
			this._$scope.$watch(() => this.dateRange.start, (value, old) => {
				this.values[0] = value;
			});
			this._$scope.$watch(() => this.dateRange.end, (value, old) => {
				this.values[1] = value;
			});
			this._$scope.$on('clearValues', () => {
				this.dateRange.start = null;
				this.dateRange.end = null;
			});

		} else if (this.viewType === 'SELECT') {
			this.values[0] = this.values[0] || this.options[0].value;
		}
	}

	// 介于的时候的大小校验
	checkTheMin() {
		if (!this.values || !this.autoFill) {
			return;
		}
		if (this.values[0] > this.values[1]) {
			this.values[1] = this.values[0];
		}
	}

	checkTheMax() {
		if (!this.values || !this.autoFill) {
			return;
		}
		if (this.values[0] > this.values[1]) {
			this.values[0] = this.values[1];
		}
	}

	// 整数型输入矫正
	inputInteger(index) {
		if (this.values[index] === null) {
			return;
		}
		let min = this.minValue || 0;
		let max = this.maxValue || 99999999;
		if (!this.allowNegative) {
			this.values[index] = Math.floor(this.values[index] || 0);
		}
		this.values[index] = this.values[index] > max ? this.lastValue : this.values[index];
		this.values[index] = this.values[index] < min ? null : this.values[index];
		this.lastValue = angular.copy(this.values[index]);
	}

	// 浮点型输入矫正
	inputFloat(index) {
		if (this.values[index] === null) {
			return;
		}
		let min = this.minValue || 0;
		let max = this.maxValue || 99999999.99;
		if (this.caption.indexOf('折扣') > -1) {
			min = 0.01;
			max = 9.99;
		}
		if (!this.allowNegative) {
			this.values[index] = Number((this.values[index] || 0).toFixed(2));
		}
		this.values[index] = this.values[index] > max ? max : this.values[index];
		this.values[index] = this.values[index] <= min ? min : this.values[index];
	}

	// 点击旗帜
	clickFlagItem(flag) {
		flag.selected = !flag.selected;
		if (flag.selected) {
			this.noFlag = false;
		}
		this.values = [];
		this.options.forEach(flag => {
			if (flag.selected === true) {
				this.values.push(flag.value);
			}
		});
	}
	// 点击了无旗帜
	clickNoFlag(flags) {
		this.noFlag = !this.noFlag;
		if (this.noFlag) {
			flags.forEach(flag => {
				flag.selected = false;
			});
			this.values = ['NO'];
		} else {
			this.values = [];
		}
	}

	checkTheMetaDataInput(content = []) {
		if (this.needCheck === 'false') {
			return;
		}
		if (this.logic === 'BETWEEN' && (this.viewType === 'DATE_UNI_YMD' || this.viewType === 'DATE' || this.viewType === 'DATE_UNI_ALL' || this.viewType === 'DATETIME')) {
			this.values[0] = this.dateRange.start;
			this.values[1] = this.dateRange.end;
		}
		if (this.values.toString() === '' || this.values.toString() === 'null') {
			content.push({
				caption: this.caption,
				uid: this.uid,
				errorTips: `${this.caption}不能为空！！`
			});
			this.errorInput = true;
		} else if (this.logic === 'BETWEEN' && ((!this.values[0] && this.values[0] !== 0) || (!this.values[1] && this.values[1] !== 0))) {
			content.push({
				caption: this.caption,
				uid: this.uid
			});
			this.errorInput = true;
		} else if ((this.logic === 'GT' || this.logic === 'GE') && (!this.values[0] && this.values[0] !== 0)) {
			content.push({
				caption: this.caption,
				uid: this.uid
			});
			this.errorInput = true;
		} else if ((this.logic === 'LT' || this.logic === 'LE') && (!this.values[0] && this.values[0] !== 0)) {
			content.push({
				caption: this.caption,
				uid: this.uid
			});
			this.errorInput = true;
		} else if (this.logic === 'BETWEEN' && this.viewType === 'INPUT_INT' && (this.values[0] > this.values[1])) {
			content.push({
				caption: this.caption,
				uid: this.uid,
				errorTips: `${this.caption}区间填写有误！！`
			});
			this.errorInput = true;
		} else {
			this.errorInput = false;
		}
	}

	clickTheMetaData() {
		this.errorInput = false;
	}
	logicChange() {
		this._$scope.$watch(() => this.logic, (value, old) => {
			if (value && old && value !== old) {
				if ((value === 'LT' || value === 'LE') && (old !== 'LT' && old !== 'LE')) {
					this.values[1] = this.values[0];
				} else if ((old === 'LT' || old === 'LE') && (value !== 'LT' || value !== 'LE')) {
					this.values[0] = this.values[1];
				}
			}
		});
	}
	/**
	 * 打开商品选择器
	 */
	openGoodSelector() {
		this._goodSelector('', this.values, false)
			.then(res => {
				this.values = res;
			})
			.catch(() => console.log('点击了取消按钮Ｏ(≧口≦)Ｏ!'));
	}
}
