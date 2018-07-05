/**
 * @author qiuzhi.zhu
 * @since 2016-10-26
 */

import { Inject } from 'angular-es-utils';
import { DateCommon } from '../../common/utils';

const MONTH_ARRAY = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MONTH_DAY_ARRAY = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

@Inject('$timeout')
export default class YearMonthPickerCtrl {
	constructor() {
		this.holderMsg = this.holderMsg || {year: '年', month: '月', day: '日'};
		this.yearList = this.yearList || this.yearBuild();
		// 月份列表
		this.monthList = MONTH_ARRAY;
		this.days = [];
		// this.date && this.dateInit(this.date);
		this.dayBuild();
	}

	/**
	 * 年份列表
	 */
	yearBuild() {
		let yearData = [];
		const	NOW_YEAR = new Date().getFullYear();
		for (let i = NOW_YEAR; i >= 2000; i--) {
			yearData.push({title: `${i}`, value: `${i}`});
		}
		return yearData;
	}


	/**
	 *  日列表(仅当选择了年月)
	 */
	dayBuild() {
		if (!this.month) {
			// 未选择月份
			this.days = [];
		} else {
			this.dayList = [];
			const monthLength = MONTH_DAY_ARRAY[this.month - 1] + (this.month === '02' ? DateCommon.leapYear(this.year) : 0);
			if (Number(this.days[0]) > monthLength) this.days[0] = monthLength.toString();
			for (let i = 1, len = monthLength; i <= len; i++) {
				if (i < 10) {
					this.dayList.push(
						{title: `${i}`, value: `${'0' + i}`}
					);
				} else {
					this.dayList.push(
						{title: `${i}`, value: `${i}`}
					);
				}
			}
		}
	}

	/**
	 * choose yearMonthDay
	 */
	chooseYearMonthDay(value, type) {
		if (type === 'year') {
			this.year = value;
			this.dayBuild();
			// this.format();
		} else if (type === 'month') {
			this.month = value;
			this.dayBuild();
			// this.format();
		}
	}

	// /**
	//  * 数据初始化
	//  */
	// dateInit(date) {
	// 	let dateList = (date || '').split('-');
	// 	this.year = '';
	// 	switch (dateList.length) {
	// 		case 3:
	// 			this.year = dateList[0];
	// 			this.month = dateList[1];
	// 			this.days.push(dateList[2]);
	// 			break;
	// 		case 2:
	// 			this.month = dateList[0];
	// 			this.days.push(dateList[1]);
	// 			break;
	// 		case 1:
	// 			this.days.push(dateList[0]);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }

	// /**
	//  * 数据处理
	//  */
	// format(day) {
	// 	this.date = '';
	// 	let dateArray = [];
	// 	this.year && dateArray.push(this.year);
	// 	this.month && dateArray.push(this.month);
	// 	day && dateArray.push(day);
	// 	this.date = dateArray.join('-');
	// }
	set date(date) {
		let dateList = (date || '').split('-');
		this.year = '';
		this.days = [];
		switch (dateList.length) {
			case 3:
				this.year = dateList[0];
				this.month = dateList[1];
				this.days.push(dateList[2]);
				break;
			case 2:
				this.month = dateList[0];
				this.days.push(dateList[1]);
				break;
			case 1:
				this.days.push(dateList[0]);
				break;
			default:
				break;
		}
	}
	get date() {
		let dateArray = [];
		this.year && dateArray.push(this.year);
		this.month && dateArray.push(this.month);
		this.days && dateArray.push(this.days[0]);
		return dateArray.join('-');
	}

}
