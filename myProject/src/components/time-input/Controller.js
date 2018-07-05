/**
 * Created by liwenjie on 2016/11/1.
 */

export default class TimeInputController {
	constructor() {
		this.old = {
			hour: this.hour || '00',
			second: this.second || '00'
		};
		this.time = this.time ? this.time : {hour: '00', second: '00'};
	}

	get hour() {
		if (this.time) {
			if (this.time.hour.toString().length === 1) {
				return '0' + this.time.hour;
			} else {
				return this.time.hour.toString();
			}
		} else {
			return '00';
		}
	}

	get second() {
		if (this.time) {
			if (this.time.second.toString().length === 1) {
				return '0' + this.time.second;
			} else {
				return this.time.second.toString();
			}
		} else {
			return '00';
		}
	}

	set hour(newValue) {
		newValue = parseInt(newValue, 10) || 0;
		this.time.hour = newValue;
		newValue >= 24 && (this.time.hour = 23);
		newValue <= 0 && (this.time.hour = '');
		newValue === 0 && (this.time.hour = '00');
	}

	set second(newValue) {
		newValue = parseInt(newValue, 10) || 0;
		this.time.second = newValue;
		newValue >= 60 && (this.time.second = 59);
		newValue < 0 && (this.time.second = '');
		newValue === 0 && (this.time.second = '00');
	}

	smartinput1(flag, e) {
		e && e.preventDefault();
		if (flag === 0) {
			this.smartinputflag = 0;
		} else if (flag === 1) {

			if (e.keyCode >= 48 && e.keyCode <= 57) {
				(this.smartinputflag = this.smartinputflag + 1);
				if (this.smartinputflag === 2) {
					document.querySelector('#second1').onfocus();
				}
			} else {
				return;
			}
		}
	}
	smartinput2(flag, e) {
		e && e.preventDefault();
		if (flag === 0) {
			this.smartinputflag = 0;
		} else if (flag === 1) {

			if (e.keyCode >= 48 && e.keyCode <= 57) {
				(this.smartinputflag = this.smartinputflag + 1);
				if (this.smartinputflag === 2) {
					document.querySelector('#second2').onfocus();
				}
			} else {
				return;
			}
		}
	}

	cancel() {
		this.time = {
			hour: this.old.hour,
			second: this.old.second
		};
	}
	confirm() {
		this.old = {
			hour: this.hour || '00',
			second: this.second || '00'
		};
	}
}
