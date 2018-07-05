/**
 * @author wenjie.li
 * @since 2016-10-12
 */
import Resource from '../../../common/Resources';
import DataManage from '../../../common/DataManage';

import angular from 'angular';

const META_NEED_MORE_ATTRIBUTE = ['确认收货时间', '付款时间', '下单时间'];

export default class ConditionEditCtrl {

	constructor(config) {
		Object.assign(this, config);
		this.tiemRadioSelect = [{
			title: '当天',
			value: 'd'
		}, {
			title: '当月',
			value: 'm'
		}];
	}

	// 初始化元数据 并绑定值
	initData() {
		this.showContent = false;
		Resource[this.metaResource]
			.query({ planId: DataManage.planId, schemas: this.schemas })
			.$promise
			.then(data => {
				// 所有可输入的元数据
				this.ruleMetas = data;
				// 值绑定
				this.ruleMetas.forEach(item => {
					item.properties && item.properties.forEach(meta => {
						if (meta.viewType === 'INPUT_STR') {
							meta.logic = 'LIKE';
						}

						if (meta.viewType === 'FLAG') {
							meta.logic = 'LIKE';
						}

						if (!meta.logic) {
							meta.logic = 'GE';
						}

						meta.values = [];

						switch (meta.viewType) {
							case 'SELECT':
								meta.logic = 'EQ';
								meta.enumList = meta.enumList || [{ fv: '未配置', rv: '1' }];
								meta.options = meta.enumList.map(item => {
									return {
										title: item.fv,
										value: item.rv
									};
								});
								break;
							case 'DATE':
								meta.logic = 'BETWEEN';
								break;
							case 'GOODS':
								meta.logic = 'ANY';
								break;
							case 'DATETIME':
								meta.logic = 'BETWEEN';
								meta.logic_temp = 'BETWEEN';
								meta.values_temp = [];
								meta.values_temp.push(new Date(new Date().getFullYear(), 0, 1));
								meta.values_temp.push(new Date(new Date().getFullYear(), 11, 31));
								meta.radioSelect = 'COMMON';
								break;
							case 'FLAG':
								meta.logic = 'ANY';
								meta.enumList = meta.enumList || [{ fv: '未配置', rv: '1' }];
								meta.options = meta.enumList.map(item => {
									let caption = angular.element(item.fv)[0].innerText;
									return {
										title: item.fv,
										value: item.rv,
										caption: caption
									};
								});
								break;
							case 'SELECT_MULTI':
							case 'SELECT_MULTI_ANY':
							case 'SELECT_MULTI_CONTAINS':
								meta.logic = 'CONTAINS';
								meta.logic = (meta.viewType === 'SELECT_MULTI_ANY' || meta.viewType === 'SELECT_MULTI') ? 'ANY' : meta.logic;
								meta.enumList = meta.enumList || [{ fv: '未配置', rv: '1' }];
								meta.options = meta.enumList.map(item => {
									return {
										title: item.fv,
										value: item.rv,
										caption: item.fv
									};
								});
								break;
							default:
								break;
						}

						if (~META_NEED_MORE_ATTRIBUTE.indexOf(meta.caption)) {
							meta.values = [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)];
							meta.needRadioSelect = true;
							meta.value_special = 'd';
						}

						let ruleIndex = this.rule
							.conditions
							.findIndex(rule => rule.condition.uid === meta.id);
						console.log(this.rule.conditions[ruleIndex]);
						if (ruleIndex > -1) {
							let rule = this.rule.conditions[ruleIndex];
							meta.logic = rule.condition.operator;
							if (~META_NEED_MORE_ATTRIBUTE.indexOf(meta.caption)) {
								meta.value_special = 'd';
								if (meta.logic === 'MEMBERDAY' || meta.logic === 'MEMBERBIRTHDAY') {
									meta.radioSelect = meta.logic;
									if (meta.logic === 'MEMBERBIRTHDAY') {
										meta.value_special = rule.condition.values[0];
									}
								} else {
									meta.radioSelect = 'COMMON';
									meta.logic_temp = meta.logic;
									meta.values = rule.condition.values;
								}
							} else if (meta.viewType === 'INPUT_FLOAT' || meta.viewType === 'INPUT_INT') {
								rule.condition.values.forEach(value => {
									meta.values.push(parseFloat(value, 10));
								});
							} else {
								meta.values = rule.condition.values;
							}
							this.clickMetaItem(meta, false, ruleIndex);
						}
					});
				});

				this.showContent = true;

				this._$timeout(() => {
					document.querySelector('#ruleNameInput').select();
				}, 100);
			}).catch(error => {
				this._TipsService.showError((error.data && error.data.message) || '元数据解析错误, 请刷新重试');
				this.showContent = true;
			});
	}

	clickMetaItem(metaItem, inRight, metaIndex) {
		console.log(metaItem);
		metaItem.selected = !metaItem.selected;
		if (metaItem.selected && metaIndex > -1) {
			this.settingRuleArr[metaIndex] = metaItem;
		} else if (metaItem.selected) {
			this.settingRuleArr.push(metaItem);
		} else {
			var i = 0;
			this.settingRuleArr.forEach((item, index) => {
				if (item.id === metaItem.id) {
					i = index;
				}
			});
			this.settingRuleArr.splice(i, 1);
			if (this.settingRuleArr.length !== 0 && inRight) {
				this.settingRuleArr[i] && (this.settingRuleArr[i].mouseover = true);
			}
		}
	}
	redCheckTip() {
		let errorflag = [];
		this._$scope.$broadcast('checkTheMetaDataInput', errorflag);
		if (errorflag.length > 0) {
			let isShow = true;
			errorflag.forEach(err => {
				if (err) {
					isShow = false;
					this._TipsService.showError(errorflag[0].errorTips);
				}
			})
			// this._TipsService.showError('请设置条件规则'); // :' + errorflag.map(item => item.caption).join());
			isShow && this._TipsService.showError('请设置条件规则'); // :' + errorflag.map(item => item.caption).join());
			return false;
		}
		if (this.settingRuleArr.length === 0) {
			this._TipsService.showError('请设置条件规则');
			return false;
		}
		return true;
	}

	nextStep() {
		this._$ccValidator.validate(this.ruleNameInputForm).then(() => {
			if (this.redCheckTip()) {
				this.modify();
				this.nextStepFn();
			}
		}, () => {
			document.querySelector('#ruleNameInput').focus();
		});
	}

	// 确认修改当前规则里的逻辑和数据并拼接title
	modify() {
		this.rule.logic = 'AND';
		this.rule.conditions = [];
		this.settingRuleArr.forEach((meta, index) => {
			let values = [];
			this.specialValue(meta);
			// if (meta.logic === 'EQ' || meta.logic === 'NOTEQ') {
			// 	meta.values.length = 1;
			// }
			meta.values.forEach(value => {
				values.push(value + '');
			});
			let title = this.translation(meta, meta.values);
			this.rule.conditions.push({
				condition: {},
				title: title
			});
			this.rule.conditions[index].condition = {
				operator: meta.logic,
				uid: meta.id,
				values: values,
				type: 'expression',
				title: title
			};
		});
	}

	specialValue(meta) {
		if (META_NEED_MORE_ATTRIBUTE.indexOf(meta.caption) > -1) {
			if (meta.radioSelect !== 'COMMON') {
				meta.logic = meta.radioSelect;
			} else {
				meta.logic = meta.logic_temp;
				meta.values = meta.values.map(value => this._$filter('date')(value, 'yyyy-MM-dd HH:mm:ss'));
			}
			if (meta.logic === 'MEMBERBIRTHDAY') {
				meta.values = [meta.value_special];
			} else if (meta.logic === 'MEMBERDAY') {
				meta.values = [];
			}
		}
	}

	// 拼接title
	translation(meta, values) {
		let logic = '';
		let valuesDes = [];

		let FlagType = ['FLAG', 'SELECT_MULTI', 'SELECT_MULTI_CONTAINS', 'SELECT_MULTI_ANY'];
		if (~FlagType.indexOf(meta.viewType)) {

			valuesDes = values.map(item => {
				let caption = '';
				meta.options.forEach(flag => {
					if (item === flag.value) {
						caption = flag.caption;
					}
				});
				return caption;
			});
			if (valuesDes.toString() === '') {
				valuesDes = ['无旗帜'];
			}
		} else {
			valuesDes = values.map(item => {
				return item + (meta.postfix || '');
			});
		}
		switch (meta.logic) {
			case 'EQ':
				logic = ' #等于# ' + valuesDes[0];
				if (meta.viewType === 'SELECT') {
					logic = ' ' + this.selectValueToTitle(values[0], meta.options);
				} else if (meta.viewType === 'DATE' || meta.viewType === 'DATETIME') {
					logic = ' #等于# ' + this.dateValueToTitle(values[0], meta);
				}
				break;
			case 'NOTEQ':
				logic = ' #不等于# ' + valuesDes[0];
				if (meta.viewType === 'SELECT') {
					logic = ' ' + this.selectValueToTitle(values[0], meta.options);
				} else if (meta.viewType === 'DATE' || meta.viewType === 'DATETIME') {
					logic = ' #不等于# ' + this.dateValueToTitle(values[0], meta);
				}
				break;
			case 'IN':
				logic = ' #包含# ' + valuesDes.join(', ');
				break;
			case 'NOTCONTAINS':
				logic = ' #不等于# ' + valuesDes.join(', ');
				break;
			case 'CONTAINS':
				logic = ' #等于# ' + valuesDes.join(', ');
				break;
			case 'LIKE':
				logic = ' #包含# ' + valuesDes.join(', ') + ' #关键字#';
				break;
			case 'NOTLIKE':
				logic = ' #不包含# ' + valuesDes.join(', ') + ' #关键字#';
				break;
			case 'ISNULL':
				logic = ' #值为空# ' + valuesDes.join(', ');
				break;
			case 'GT':
				logic = ' #大于# ' + valuesDes[0];
				if (meta.viewType === 'DATE' || meta.viewType === 'DATETIME') {
					logic = ' #晚于# ' + this.dateValueToTitle(values[0], meta);
				}
				break;
			case 'GE':
				logic = ' #大于等于# ' + valuesDes[0];
				if (meta.viewType === 'DATE' || meta.viewType === 'DATETIME') {
					logic = ' #晚于等于# ' + this.dateValueToTitle(values[0], meta);
				}
				break;
			case 'LT':
				logic = ' #小于# ' + valuesDes[0];
				if (meta.viewType === 'DATE' || meta.viewType === 'DATETIME') {
					logic = ' #早于# ' + this.dateValueToTitle(values[0], meta);
				}
				break;
			case 'LE':
				logic = ' #小于等于# ' + valuesDes[0];
				if (meta.viewType === 'DATE' || meta.viewType === 'DATETIME') {
					logic = ' #早于等于# ' + this.dateValueToTitle(values[0], meta);
				}
				break;
			case 'BETWEEN':
				logic = ' #介于# ' + valuesDes.join(' - ') + ' #之间#';
				if (meta.viewType === 'DATE' || meta.viewType === 'DATETIME') {
					logic = ' ' + this.dateValueToTitle(values[0], meta) + ' #到# ' + this.dateValueToTitle(values[1], meta) + ' #之间#';
				}
				break;
			case 'AND':
				logic = ' #是# ' + valuesDes.join(' #也是# ');
				break;
			case 'NOT':
				logic = ' #不是# ' + valuesDes.join(' #不是# ');
				break;
			case 'NOTANY':
				logic = ' #不包含# ' + valuesDes.join(' #或# ');
				break;
			case 'ANY':
				logic = ' #包含# ' + valuesDes.join(' #或# ');
				break;
			case 'ALL':
				logic = ' #满足# ' + valuesDes.join(' #且# ');
				break;
			case 'MEMBERDAY':
				logic = ' #是# ' + '会员日 当天';
				break;
			case 'MEMBERBIRTHDAY':
				let index = this.tiemRadioSelect.findIndex(item => item.value === valuesDes[0]);
				logic = ' #是# ' + '会员生日' + this.tiemRadioSelect[index].title;
				break;
			default:
				break;
		}

		return meta.caption + ':' + logic;
	}

	selectValueToTitle(value, options) {
		let title = '';
		options.forEach(item => {
			if (item.value === value) {
				title = item.title;
			}
		});
		return title;
	}

	dateValueToTitle(value, meta) {
		let time = '';
		if (meta.viewType === 'DATE') {
			time = 'yyyy年MM月dd日';
		} else if (meta.viewType === 'DATETIME') {
			time = 'yyyy年MM月dd日 HH时mm分ss秒';
		}
		return this._$filter('date')(Date.parse(value), time);

	}

	cancel() {
		this.gradeId = this._$state.params['gradeId'];
		this._$state.go('le.loyalty.levelRules-' + this.gradeId);
	}

	conRule(rule) {
	}

	leLogic(item) {
		return (item.logic !== 'MEMBERBIRTHDAY' && item.logic !== 'MEMBERDAY') ? item.logic : 'BETWEEN';
	}
}

