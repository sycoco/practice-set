/**
 * @author qiuzhi.zhu
 * @since 2016-10-12
 */
import { Inject } from 'angular-es-utils';

const DAY_ARRAY = 31;

@Inject('$element', '$timeout', '$scope')
export default class DayPickerCtrl {
	constructor() {
		this.mulitiple = this.mulitiple || true;
		this.holderMsg = this.holderMsg || '';
		this.chooseDay = this.chooseDay || [];
		this.dayBuild();
		if (this.direction === 'top') {
			this.panelStyle = {
				bottom: '100%'
			};
		} else {
			this.panelStyle = {
				top: '100%'
			};
		}
		const close = () => {
			this.isOpen = false;
			this._$scope.$apply();
		};
		// 因为2.9.3版本的组件 下拉框有BUG, 所以,写了下面的代码
		window.addEventListener('click', close);
		this._$scope.$on('$destroy', () => {
			window.removeEventListener('click', close);
		});
	}
	stop(e) {
		e.stopPropagation();
	}

	/**
	 * 月份变化导致dayList变化
	 * 当前选择的日期如果比当前月最后一天大
	 * 则改为当前月最后一天
	 */
	$onChanges() {
		this.dayBuild();
	}
	/**
	 * 生成日子数组
	 */
	dayBuild() {
		this.dayFormat();
		this.dayList = this.dayList || [];// 初始化
		if (!this.dayList.length > 0) {
			for (let i = 1, len = DAY_ARRAY; i <= len; i++) {
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
	 * 数据处理
	 */
	dayFormat() {
		this.clientLeftOrRight();
		if (this.chooseDay) {
			// 打开panel后重新渲染
			this._$timeout(() => {
				this.days = this.chooseDay.slice();
				// this.day = this.chooseDay.toString().replace(/\,/g, ', ');
			}, 100);
		}
	}

	get day() {
		return this.chooseDay.toString().replace(/\,/g, ', ');
	}

	set day(input) {
	}

	/**
		* 选择日子
		*/
	dayPicker(day) {
		if (!this.mulitiple) {
			this.days = [];
			this.days.push(day);
			this.dayPickerSave();
			return;
		}
		let index = this.days.indexOf(day);
		if (index > -1) {
			this.days.splice(index, 1);
		} else {
			this.days.push(day);
		}
	}

	/**
		* 保存选择的日子
		*/
	dayPickerSave() {
		if (this.days) {
			this.days.sort((a, b) => {
				return a - b;
			});
			this.chooseDay = this.days.slice();
			this.day = this.days.toString().replace(/\,/g, ', ');
			typeof this.onSelectChange === 'function' && this.onSelectChange({day: this.day});
		}
	}

	/**
		* 重置选择面板
		*/
	dayPickerReset() {
		this.dayFormat();
	}

	/**
	 * 清空
	 */
	clear() {
		this.days = [];
	}

	clientLeftOrRight() {
		const daySelect = this._$element[0].querySelector('.daySelect');
		const left = daySelect.getBoundingClientRect().left;
		const clientWidth = document.body.clientWidth;
		const ele = this._$element[0].querySelector('.daySelectDay');
		if (ele && clientWidth - left < ele.offsetWidth) {
			ele.style.right = 0;
			ele.style.left = 'auto';
		} else {
			ele.style.left = 0;
			ele.style.right = 'auto';
		}
	}

}
