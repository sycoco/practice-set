/**
 * Created by liwenjie on 2017/3/3.
 */
import './_style.scss';

export default class ConfigModalConfirmCtrl {

	constructor() {
		this.desc = this.descString(this.requestObj);
	}
	descString(requestObj) {
		let str = '';
		if (requestObj.onlyCodeStyle) {
			str = requestObj.parmString;
		} else {
			let i = 1;
			requestObj.columnsDef.forEach((item, index) => {
				if (item.fieldName && item.value) {
					let valuDes = item.value;
					if (item.option) {
						valuDes = item.option.filter(option => option.value === item.value)[0].title;
					}
					str += `【${i++}】&nbsp` + item.caption + ':&nbsp&nbsp' + valuDes + '<br>';
				}
			});
		}
		return '<p>' + str + '</p>';
	}
}
