/**
 * Created by liwenjie on 2016/12/1.
 */
const timeUnit = {
	YEAR: '年',
	MONTH: '个月',
	WEEK: '周',
	DAY: '天',
	HOUR: '小时'
};
import {Inject} from 'angular-es-utils';

@Inject('$scope')
export default class validitySetting {
	$onInit() {
		this._$scope.$on('nextStep', () => {
			this.timeConfigObj.result = this.timeObj();
		});
	}

	constructor() {
		this.intervalTimeUnits = [
			{title: '天', value: 'DAY'},
			{title: '月', value: 'MONTH'},
			{title: '年', value: 'YEAR'}
		];
		this.selectList2 = [
			{title: '当年', value: 0},
			{title: '1年后', value: 1},
			{title: '2年后', value: 2},
			{title: '3年后', value: 3},
			{title: '4年后', value: 4},
			{title: '5年后', value: 5}
		];
		this.interval_2 = 1; // 几年/月/日 后失效
		this.intervalTimeUnit = 'MONTH'; // 单位

		this.interval_3_Ary = [1];
		this._timeConfigObj = {
			fixValue: '12-31'
		};// 几月几日失效
		this.title = this.timeToUI(this.timeConfigObj);
	}

	timeToUI(obj) {

		// 规则有效期 等级规则有效期 积分有效期
		let type = obj['effectiveTypeName'] || obj['gradePropertyDateSectionName'] || obj['overdueStrategyName'] || '';
		let config = obj['effectiveContentConfig'] || obj['unionRulePropertySectionConfig'] || obj['overdueStrategyConfig'] || {};
		this.config = config;
		this.config = config;
		switch (type) {
			case 'NEVER': // 永久有效
				this.timeConfigType = 4;
				return '永久有效';
			case 'INTERVAL': // 制定单位时间后过期
				this.timeConfigType = 2;
				this.interval_2 = config.interval;
				this.intervalTimeUnit = config.intervalTimeUnit;
				return config.interval + timeUnit[config.intervalTimeUnit];
			case 'INTERVAL_FIX': // 制定单位内的固定时间过期
				this.timeConfigType = 3;
				let year = config.interval === 0 ? '今年' : config.interval;
				this.interval_3_Ary[0] = config.interval ? config.interval : 0;
				this.intervalTimeUnit = 'YEAR';
				this._timeConfigObj.fixValue = config.fixValue;
				let fixValue = config.fixValue.split('-');
				return year + '年' + fixValue[0] + '月' + fixValue[1] + '日';
			default:
				this.timeConfigType = 4;
				return (config.interval || '') + config.timeUnit;
		}
	};

	timeObj() {
		const type = {
			// 1: 'INTERVAL_FIX',
			2: 'INTERVAL',
			3: 'INTERVAL_FIX',
			4: 'NEVER'
		};
		const interval = {
			// 1: undefined,
			2: this.interval_2,
			3: this.interval_3_Ary[0],
			4: undefined
		};
		const intervalTimeUnit = {
			// 1: 'YEAR',
			2: this.intervalTimeUnit,
			3: 'YEAR',
			4: 'FOREVER'
		};
		const fixValue = {
			1: '12-31',
			2: undefined,
			3: this._timeConfigObj && this._timeConfigObj.fixValue,
			4: undefined
		};
		let yearMouth = this._timeConfigObj.fixValue.split('-');
		const validityTitle = {
			// 1: '于 今年12月31日 失效',
			2: '自发放之日起 ' + this.interval_2 + timeUnit[this.intervalTimeUnit] + ' 内有效',
			3: '自发放之日起 ' + this.interval_3_Ary[0] + '年后的' + (this._timeConfigObj && this._timeConfigObj.fixValue && (yearMouth[0] + '月' + yearMouth[1] + '日')) + ' 内失效',
			4: '自发放之日起 永久有效'
		};
		return {
			type: type[this.timeConfigType],
			timeConfig: {
				interval: interval[this.timeConfigType],
				intervalTimeUnit: intervalTimeUnit[this.timeConfigType],
				fixValue: fixValue[this.interval_3_Ary[0] ? this.timeConfigType : 1]
			},
			validityTitle: this.interval_3_Ary[0] ? validityTitle[this.timeConfigType] : '自发放之日起 当年12月31日 内有效'
		};
	}
}
