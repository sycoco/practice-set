/**
 * @author qiuzhi.zhu
 * @since 2016-10-26
 */

import angular from 'angular';

import './_year-month-picker.scss';
import template from './year-month-picker.tpl.html';
import controller from './YearMonthPickerCtrl.js';

const ddo = {
	template,
	controller,
	bindings: {
		noYear: '<?',
		yearList: '<?',
		holderMsg: '<?',
		date: '=?',
		direction: '@?'
	}
};

export default angular.module('le.components.yearMonthPicker', [])
	.component('leYearMonthPicker', ddo)
	.name;
