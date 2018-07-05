/**
 * @author qiuzhi.zhu
 * @since 2016-11-15
 */
const chineseNumChar = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const chineseNumUnit = ['零', '', '十', '百', '千', '万'];

const numberToChinese = number => {
	if (number !== 0 && !number) return;
	let chineseNumber = '';
	let i = 0;
	let hasZore = false;
	while (number >= 1) {
		let	mod = number % 10;
		number = Math.floor(number / 10);
		i++;
		let str = '';
		if (number < 1 && i === 2 && mod === 1) {
			str = chineseNumUnit[i];
		} else if (number > 1 && mod === 0 && !hasZore) {
			str = chineseNumUnit[0];
			hasZore = true;
		} else {
			str = chineseNumChar[mod] + (chineseNumChar[mod] ? chineseNumUnit[i] : '');
		}
		chineseNumber = str + chineseNumber;
	}
	return chineseNumber;
};


export {
	numberToChinese
};
