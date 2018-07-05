/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-02-28
 */

import angular from 'angular';
import {Inject} from 'angular-es-utils';

// import moment from 'moment';

@Inject('$state')
export default class RuleEditorController {

	constructor() {
		/**
		 * // 规则数少的时候, 空间足够展示, 就默认展开状态, 陆说:还是默认全部收起, 所以注释掉. 开发时为了方便调试,可将此注释打开
		 if (this.ruleList.length <= 3) {
			this.ruleList.forEach(item => {
				item.ruleGroup.folding = true;
			});
		}
		 */
	}

	/**
	 * rule operator function according to operator param
	 * @param operator
	 * @param index
	 */
	ruleOperate(operator, index) {
		let targetRule;
		switch (operator) {
			case 'add':
				if (!this.ruleList) {
					this.ruleList = [];
				}
				targetRule = {
					ruleGroup: {
						title: '积分规则' + (this.ruleList.length + 1),
						conditions: [{
							title: '未编辑',
							condition: {
								type: 'expression',
								uid: 9999,
								title: '',
								operator: '',
								values: [
								]
							}
						}],
						folding: true
					},
					isNewRule: true
				};
				this.ruleList.push(targetRule);
				index = this.ruleList.length - 1;
				// this._$state.go('le.loyalty.ruleConditionEdit', {ruleIndex: index});
				break;
			case 'bottom':
				targetRule = this.ruleList.splice(index, 1);
				this.ruleList.push(targetRule[0]);
				break;
			case 'copy':
				targetRule = angular.copy(this.ruleList[index]);
				// targetRule.ruleGroup.title = moment().format('YYYY-MM-DD HH:mm:ss');
				targetRule.ruleGroup.title = '积分规则' + (this.ruleList.length + 1);
				targetRule.isNewRule = true;
				this.ruleList.splice(index + 1, 0, targetRule);
				break;
			case 'delete':
				this.ruleList.splice(index, 1);
				break;
			// TODO: 需要跳转路由到规则编辑器
			case 'edit':
				console.log(this.ruleList[index]);
				// this._$state.go('组件跳转 le.loyalty.ruleConditionEdit', {rule: this.ruleList[index], index: index});
				break;
			case 'down':
				if (index + 1 < this.ruleList.length) {
					targetRule = this.ruleList.splice(index + 1, 1);
					this.ruleList.splice(index, 0, targetRule[0]);
				}
				break;
			case 'top':
				targetRule = this.ruleList.splice(index, 1);
				this.ruleList.unshift(targetRule[0]);
				this.top = true;
				break;
			case 'up':
				if (index - 1 >= 0) {
					targetRule = this.ruleList.splice(index, 1);
					this.ruleList.splice(index - 1, 0, targetRule[0]);
				}
				break;
			default:
				break;
		}
	}

	/**
	 * 转换格式
	 */
	/**
	 * 把修饰逻辑词用灰色样式的标签包裹
	 * @param str
	 * @returns {*}
	 */
	logicalWordColor(str) {
		let replaceStrAry = ['不等于', '等于', '不包含', '包含', '含有', '不包含', '包含', '值为空', '晚于等于', '早于等于', '晚于', '早于', '大于等于', '大于', '小于等于', '小于', '介于', '不是', '是', '满足', '满足', '-', '到', '且', '或', '之间', '关键字'];
		replaceStrAry.forEach(replaceStr => {
			str = str.replace(new RegExp(`#${replaceStr}#`, 'g'), `<span class="prepositions">${replaceStr}</span>`);
		});
		return str;
	}
}
