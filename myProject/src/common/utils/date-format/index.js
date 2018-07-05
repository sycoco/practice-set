/**
 * @author qiuzhi.zhu
 * @since 2016-11-15
 */

const isDate = time => {

	const dt = new Date(time);
	const is_date = dt.getDate();
	return !isNaN(is_date);

};

const dateToString = date => {
	if (!isDate(date)) return;
	let dt = new Date(date);
	return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
};

/**
 * 解析有效期配置对象 生成前端展示的Titile
 * @param obj
 * @returns {*}
 */
const timeToTitle = obj => {
	// 规则有效期 等级规则有效期 积分有效期
	let type = obj['effectiveTypeName'] || obj['gradePropertyDateSectionName'] || obj['overdueStrategyName'] || '';
	let config = obj['effectiveContentConfig'] || obj['unionRulePropertySectionConfig'] || obj['overdueStrategyConfig'] || {};
	switch (type) {
		case 'NEVER': // 永久有效
			return '自发放之日起 永久有效';
		case 'INTERVAL': // 制定单位时间后过期
			return '自发放之日起 ' + config.interval + intervalTimeUnitToTitle(config.intervalTimeUnit) + ' 内有效';
		case 'INTERVAL_FIX': // 制定单位内的固定时间过期
			let fixValue = config.fixValue.split('-');
			let year = (config.interval === 0 || !config.interval) ? '当年' : (config.interval + '年后的');
			return '自发放之日起 ' + year + fixValue[0] + '月' + fixValue[1] + '日' + ' 内有效';
		default:
			return (config.interval || '') + config.timeUnit;
	}
};
/**
 * 将前端的有效期时间组件 生成 后端有效期配置对象
 * @param time
 * @returns {*}
 */
const timeToConfigobj = time => {
	switch (time.timeConfigType) {
		case 1: // 今年12月31日
			return {
				interval: 0, // 有效期
				intervalTimeUnit: 'YEAR', // 有效期单位
				fixValue: '12:31'
			};
		case 2: //  年/月/天 后失效
			return {
				interval: time.everyInterval,
				intervalTimeUnit: time.intervalTimeUnit
			};
		case 3:  // 年后的 几月几日失效
			return {
				interval: 1,
				intervalTimeUnit: 'YEAR',
				fixValue: time.fixValue
			};
		case 4: // 永久有效
			return {
				intervalTimeUnit: 'FOREVER'
			};
		default:
			break;
	}
};

const intervalTimeUnitToTitle = unit => {
	let timeUnit = {
		YEAR: '年',
		MONTH: '个月',
		WEEK: '周',
		DAY: '天',
		HOUR: '小时'
	};
	return timeUnit[unit];
};

/**
 * 闰年判断
 */
const	leapYear = year => {
	if (!year) return false;
	return (year % 4 === 0) && (year % 100 !== 0) || (year % 400 === 0);
};

export {
	isDate,
	dateToString,
	timeToTitle,
	timeToConfigobj,
	leapYear
};
