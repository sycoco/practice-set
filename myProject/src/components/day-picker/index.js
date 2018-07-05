/**
 * @author qiuzhi.zhu
 * @since 2016-10-12
 */

import angular from 'angular';

import './_day-picker.scss';
import template from './day-picker.tpl.html';
import controller from './DayPickerCtrl.js';

const ddo = {
	template,
	controller,
	bindings: {
		chooseDay: '=?',
		holderMsg: '<?',
		dayList: '<?',
		isOpen: '=?',
		mulitiple: '<?',
		onSelectChange: '&?',
		direction: '@?',
		autoClose: '=?'
	}
};

export default angular.module('le.components.dayPicker', [])
	.component('leDayPicker', ddo)
	.name;
