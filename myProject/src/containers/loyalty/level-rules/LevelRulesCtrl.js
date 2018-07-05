/**
 * Created by liwenjie on 2016/10/25.
 */

import { Inject } from 'angular-es-utils';
import angular from 'angular';
import Resources from '../../../common/Resources.js';
import DataManage from '../../../common/DataManage';
import CommonCtrl from '../CommonCtrl';
import * as DateCommon from '../../../common/utils/date-format';


@Inject('PublicService', '$q', '$scope', '$ccGrid', '$ccValidator', '$timeout', '$ccValidator', 'exDataService', 'TipsService', '$filter', '$state', '$ccModal')
export default class LevelRulesCtrl extends CommonCtrl {

	constructor() {
		super();
		this._PublicService.onShopChange(this.init.bind(this), this);
		this.basicDate();
		this.reloadDate = this.init;
		this._$scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
			let params = this._$state.params['editingRule'];
			if (!params || (fromState.name !== 'le.loyalty.levelruleConditionEdit' && fromState.name !== 'le.loyalty.levelruleExpirationEdit')) {
				this.didinit = true;
				this.init();
			} else {
				this.didinit = true;
				this.showContent = false;
				this.rules = this.editedDateToBigDate(params.allRules);
				this.oldRuleList = params.oldRuleList;
				this.gradeId = params.gradeId;
				this.setting = params.setting;
				this.bindUnionRulePropertyto$ctrl(params.setting.unionRuleProperty || {});
				this.showContent = true;
			}
		});
		this.gradeId = this._$state.current.name.split('-')[1];
		this.ensureInit();
	}

	// 确保直接刷新的时候, 不执行$stateChangeSuccess也会init
	ensureInit() {
		this._$timeout(() => {
			if (!this.didinit) {
				this.reloadDate();
			}
		});
	}

	/**
	 * 页面基本方法 ================================================
	 */
	initConfigInfo() {
		this.reloadDate();
	}

	reloadDate() {
	}

	/**
	 * 基本数据设置
	 */
	basicDate() {
		this.selectTypeList = [
			{ title: '固定开始日期', value: 'ABSOLUTE' },
			{ title: '滚动开始日期', value: 'FIX_RELATIVE' },
			{ title: '滚动统计周期', value: 'RELATIVE' }
		];
		this.selectList2 = [
			{ title: '当年', value: 0 },
			{ title: '1年前', value: 1 },
			{ title: '2年前', value: 2 },
			{ title: '3年前', value: 3 },
			{ title: '4年前', value: 4 },
			{ title: '5年前', value: 5 }
		];
		this.selectList3 = [
			{ title: '年', value: 'YEAR' },
			{ title: '月', value: 'MONTH' },
			{ title: '日', value: 'DAY' }
		];
		this.rangType = ['ABSOLUTE'];
		this.relativeTimeAry = ['1-1'];
		this.showLowestGradeRuleConfig = DataManage.allConfig.showLowestGradeRuleConfig;

		this.selected2 = ['0']; // 滚动开始时间 默认选择 今年
		// this.time2 = ['1', '1']; // 滚动开始时间 默认时间
		this.selected3 = ['1']; // 滚动统计周期 默认选择 年
		this.time3 = [1]; // 滚动统计周期 默认 1 年
		this.timer = null;
		document.onclick = () => {
			this.showFloatBlock = false;
		};
		this.noShow = false;
	}

	init() {
		this.showContent = false;
		this.initLevelConfig();
		let id = this.gradeId;
		let config = this.getConfig(id);
		let gradesList = this.getGradesList(id);
		let promises = [config, gradesList];
		this._$q.all(promises).then(resulet => {
			let [allConfig, gradesList] = resulet;
			this.SIMPLE = allConfig.simple;
			let config = allConfig.config;
			this.modifyToLocal(allConfig.data);
			this.oldRuleList = allConfig.data;
			if (this.SIMPLE) {
				this.getProperties().then(properties => {
					let _uiObj = this.assemble_Simple(gradesList, properties);
					this.gridObj = this.bindValue_Simple(_uiObj, config);
					this.configGrid(this.gridObj, properties);
					this.showContent = true;
				});
			} else {
				this.assemble_and_bindValue_complex(gradesList, allConfig.data);
				this.showContent = true;
			}
		});
	}

	// *1 初始化等级配置
	initLevelConfig() {
		this.setting = {};
		Resources.GradesResource.query({ planId: this._PublicService.planId }).$promise.then(data => {
			DataManage.levels = data;
		}).then(() => {
			let grade = DataManage.levels.filter(item => {
				return item.id + '' === this.gradeId + '';
			})[0];
			const defaultDate = DataManage.allConfig.ruleExecuteDate && DataManage.allConfig.ruleExecuteDate.split(':') || ['00', '00'];
			// 忠诚度改造， 执行时间去除
			// let ruleRunDate = grade.ruleRunDate && grade.ruleRunDate.split(':') || defaultDate;
			// this.setting.startTime = {
			// 	hour: ruleRunDate[0],
			// 	second: ruleRunDate[1]
			// };
			this.setting.ruleEnabled = grade.ruleEnabled;
		});
	}

	// *2 获取配置 获取很可能残疾的已有配置信息 =>时间配置,已有规则组,是否简版
	getConfig(id) {
		return Resources.GradesRuleListesource.get({ planId: DataManage.planId, gradeId: id }).$promise
			.then(data => {
				this.setting.unionRuleProperty = data.unionRuleProperty || {};
				this.bindUnionRulePropertyto$ctrl(data.unionRuleProperty || {});
				return {
					timeConfig: data.unionRuleProperty,
					config: data.gradeRuleList,
					simple: data.configLevelValue === 'SIMPLE',
					data: data
				};
			},
			() => this._TipsService.showError('获取配置失败'));
	}

	// *3 获取所有等级列表
	getGradesList(id) {
		return Resources.GradesGradListesource.query({ planId: DataManage.planId, gradeId: id }).$promise;
	}

	// 简版:
	// *4 获取简版配置列表
	getProperties() {
		return Resources.GradesMetasResource.query({ planId: DataManage.planId }).$promise
			.then(data => {
				let r = data.filter(item => item.properties.length);
				if (data.length === 0) {
					throw new Error('properties为空!');
				} else {
					r = r[0].properties;
					return r;
				}
			}, () => this._TipsService.showError('获取属性配置失败'));
	}

	// 5 拼装简版UI对象
	assemble_Simple(gradesList, properties) {
		let metas = properties.map(item => {
			return {
				id: item.id,
				schemaId: item.schemaId,
				caption: item.caption,
				values: []
			};
		});
		console.log('metas');
		console.log(metas);

		gradesList.forEach(grade => {
			grade.ruleGroup = angular.copy(metas);
			grade.validate = {
				effectiveTypeName: 'NEVER',
				effectiveContentConfig: {
					interval: 1,
					intervalTimeUnit: 'MONTH'
				}
			};
		});
		return gradesList;
	}

	// 6 绑定值到简版UI对象
	bindValue_Simple(_uiObj, config) {
		// TODO: id已有Id的绑定
		let allValue = {};

		config.forEach(item => {
			if (item.ruleType === 'UPGRADE') {
				allValue[item.configId] = {};
				item.ruleContentList.forEach(con => {
					allValue[item.configId]['validate'] = {
						effectiveTypeName: con.effectiveTypeName || 'NEVER',
						effectiveContentConfig: {
							interval: con.effectiveContentConfig && con.effectiveContentConfig.interval || 1,
							intervalTimeUnit: con.effectiveContentConfig && con.effectiveContentConfig.intervalTimeUnit || 'MOUTH'
						}
					};
					con.conditions.forEach(rule => {
						allValue[item.configId][rule.condition.uid] = rule.condition.values || [];
					});
				});
			}
		});
		_uiObj.forEach(grade => {
			grade.ruleGroup.forEach(rule => {
				rule.values = allValue[grade.id] && allValue[grade.id][rule.id] || [];
				rule.values = rule.values.map(item => parseFloat(item) || null);
			});
			(allValue[grade.id] && allValue[grade.id]['validate']) && (grade.validate = allValue[grade.id]['validate']);
		});
		return _uiObj;
	}

	// 7 配置表格
	configGrid(obj, properties) {
		let htmlTpls = properties.map((item, index) => {
			let caption = item.caption.replace('累积实付金额(不含邮费)', '累计订单金额');
			caption = caption.replace('(不含邮费)', '');
			caption = caption.replace('实付金额', '金额');
			let valuesLocation = 'entity.ruleGroup' + `[${index}]` + '.values';
			return `<div>${caption}: <le-meta-data-input view-type="${item.viewType}" suffix="${item.postfix}" values="${valuesLocation}"></le-meta-data-input></div>`;
		});
		obj.forEach((item, index) => item.lvIndex = index);
		this.levelRulesSimpleSetting = {
			externalData: obj,
			showPagination: false,
			columnsDef: [{
				field: 'title',
				displayName: '等级级别',
				align: 'left',
				cellTemplate: '<span ng-class="{lvIndex: entity.lvIndex !== 0}">Lv.{{entity.lvIndex}}</span>',
				width: '15%'
			}, {
				displayName: '等级名称',
				align: 'left',
				cellTemplate: '<span  ng-class="{caption: entity.lvIndex !== 0}" ng-bind="entity.caption"></span>',
				width: '15%'
			}, {
				displayName: '升级条件(订单规则均不含邮费)',
				align: 'left',
				cellTemplate: '<div ng-if="entity.lvIndex === 0">潜客无需计算</div>' +
					'<div ng-if="entity.lvIndex !== 0" class="update">' + htmlTpls.join('') + '</div>'
			}, {
				field: 'baodi',
				displayName: '等级有效期',
				align: 'left',
				cellTemplate: '<span ng-class="{baodiTip: entity.lvIndex !== 0}" ng-if="entity.bottom">保底等级永久有效</span>' +
					'<validity-setting ng-if="!entity.bottom" time-config-obj="entity.validate" simple="true"></validity-setting>'
			}],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">暂无数据</div>'
		};
	}

	// 8 解析UI对象生成请求参数
	generateRequestParam_Simple(open) {
		let gradeRuleList = [];
		this.gridObj.forEach(grade => {
			let ruleContentList = [];
			if (grade.lvIndex !== 0) { // 如果是潜客 则不要规则
				const temp = grade.ruleGroup.filter(item => {
					return item.values[0];
				});
				ruleContentList = temp.map(item => {
					return {
						title: '简版' + item.caption,
						logic: 'AND',
						effectiveTypeName: grade.validate.result && grade.validate.result.type || 'NEVER',
						effectiveContentConfig: grade.validate.result && grade.validate.result.timeConfig || undefined,
						conditions: [{
							title: item.caption + '大于等于' + (item.values[0] || 0),
							condition: {
								type: 'expression',
								uid: item.id,
								title: item.caption + '大于等于' + (item.values[0] || 0),
								operator: 'GE',
								values: [item.values[0] + '']
							}
						}]
					};
				});
			}

			let rule = {
				cardGradePlanId: this.gradeId,
				cardPlanId: DataManage.planId,
				configId: grade.id,
				ruleContentList: ruleContentList,
				ruleType: 'UPGRADE'
			};
			(ruleContentList && ruleContentList.length !== 0) && gradeRuleList.push(rule);

		});
		this.oldRuleList.gradeRuleList.forEach(itemOld => {
			gradeRuleList.forEach(item => {
				if (itemOld.configId === item.configId && itemOld.ruleType === item.ruleType) {
					item.id = itemOld.id;
				}
			});
		});
		this.oldRuleList.gradeRuleList = gradeRuleList;
		this.newRuleList = this.oldRuleList;
		this.timeSetting = {
			ruleEnabled: this.setting.ruleEnabled, // 当前规则是否启用
			// ruleRunDate: this.setting.startTime.hour + ':' + this.setting.startTime.second,
			unionRuleProperty: { // 统一的规则属性
				// id: 1, // 主键
				gradePropertyDateSectionName: this.rangType[0], // 属性的统计周期 可选值 ABSOLUTE | RELATIVE | FIX_RELATIVE
				unionRulePropertySectionConfig: { // 相应的周期配置时间
					fixDate: this._$filter('date')(this.absoluteTime, 'yyyy-MM-dd'), // 绝对时的开始时间 ABSOLUTE 时存在
					interval: this.rangType[0] === 'RELATIVE' ? this.relativeInterval[0] : this.fixRelativeInterval[0], // 相对统计周期的数字值 RELATIVE | FIX_RELATIVE 滚动统计时这里表示的是年
					intervalTimeUnit: this.rangType[0] === 'RELATIVE' ? this.relativeUnit[0] : 'YEAR', // 相对统计周期的单位值 RELATIVE | FIX_RELATIVE 滚动统计时这里只能为 YEAR
					fixValue: this.fixValue// 滚动的开始时间 格式 月-日 FIX_RELATIVE
				}
			}
		};
		open && (this.timeSetting.ruleNowEnabled = true);
		this.newRuleList = Object.assign(this.newRuleList, this.timeSetting);
		return this.newRuleList;
	}

	// 复杂版:
	// 4 拼装复杂版UI对象
	assemble_complex() {

	}

	// 5 绑定值到复杂版UI对象
	assemble_and_bindValue_complex(a, b) {
		console.log(b);
		this.rules = this.assemble(a, b);
	}

	/**
	 * 以下为数据处理方法 ================================================
	 */

	/**
	 * 将后端数据结构转换成前端逻辑的数据结构:  补齐Values数组
	 * @param variable
	 * @returns {*}
	 */
	modifyToLocal(data) {
		if (!data || !data.gradeRuleList) {
			return;
		}
		data.gradeRuleList.forEach(item => {
			item.ruleContentList.forEach(item => {
				item.conditions.forEach(conditions => {
					let logic = conditions.condition.operator;
					if ((logic === 'LT' || logic === 'LE') && conditions.condition.values.length === 1) {
						// TODO http://jira.yunat.com/browse/CRMEP-2176 修复
						// conditions.condition.values.unshift('0');
					} else if ((logic === 'GT' || logic === 'GE') && conditions.condition.values.length === 1) {
						conditions.condition.values.push(conditions.condition.values[0]);
					}
				});
			});
		});
	}

	/**
	 * 将前端数据结构转换成后端逻辑的数据结构:  修剪Values数组
	 * @param variable
	 * @returns {*}
	 */
	unModify(data) {
		if (!data || !data.gradeRuleList) {
			return;
		}
		data.gradeRuleList.forEach(item => {
			item.ruleContentList.forEach(item => {
				delete item.validDate;
				delete item.validDateUnit;
				item.conditions.forEach(conditions => {
					let logic = conditions.condition.operator;
					if ((logic === 'LT' || logic === 'LE') && conditions.condition.values.length >= 2) {
						// TODO  小于或者是小于等于时  直接获取values数组中的第一个值
						// TODO http://jira.yunat.com/browse/CRMEP-2176 修复
						// conditions.condition.values = [conditions.condition.values[conditions.condition.values.length - 1]];
						conditions.condition.values.length = 1;
					} else if ((logic === 'GT' || logic === 'GE') && conditions.condition.values.length >= 2) {
						conditions.condition.values.length = 1;
					}
				});
			});
		});
	}

	/**
	 * 将数据的"编辑结构"加工成"展示结构"
	 * @returns 展示结构的数据
	 */
	editedDateToBigDate(rules) {
		rules.forEach(item1 => {
			item1.ruleGroup.update.forEach(item2 => {
				item2.title = item2.source.title;
				item2.condition = item2.source.conditions.map(item3 => item3.title);
			});
			item1.ruleGroup.keeping.forEach(item2 => {
				item2.title = item2.source.title;
				item2.condition = item2.source.conditions.map(item3 => item3.title);
			});
		});
		return rules;
	}

	bindUnionRulePropertyto$ctrl(unionRuleProperty) {
		const config = unionRuleProperty.unionRulePropertySectionConfig;
		// 类型
		this.rangType[0] = unionRuleProperty.gradePropertyDateSectionName || 'ABSOLUTE';
		// 绝对时间
		this.absoluteTime = Date.parse((config && config.fixDate) || DataManage.allConfig.gradeDataCountDateStart || '2008/1/1');

		// 滚动开始时间
		this.fixRelativeInterval = [(config && config.interval) || 0];
		this.fixValue = (config && config.fixValue) || '01-01';

		// 滚动统计周期
		this.relativeUnit = [(config && config.intervalTimeUnit) || 'DAY'];
		this.relativeInterval = [(config && config.interval) || 1];

		switch (this.rangType[0]) {
			case 'ABSOLUTE':
				break;
			case 'FIX_RELATIVE':
				this.relativeInterval = [1];
				break;
			case 'RELATIVE':
				this.fixRelativeInterval = [0];
				break;
		}
	}

	/**
	 * 组装 等级列表 和 所有规则
	 * @returns 展示结构的数据  复杂版
	 */
	assemble(gradeList, ruleList) {
		gradeList.length === 0 && this._TipsService.showError('没有配置任何等级');
		this.setting.unionRuleProperty = ruleList.unionRuleProperty || {};
		this.bindUnionRulePropertyto$ctrl(ruleList.unionRuleProperty || {});

		let grade = gradeList.map(item => {
			let grade = item;
			item.title = item.caption;
			item.baodi = item.bottom;
			return grade;
		});
		grade.forEach(grade => {
			let updateRule = ruleList
				.gradeRuleList
				.filter(rule => {
					if (grade.id === rule.configId &&
						rule.ruleContentList &&
						rule.ruleType === 'UPGRADE') {
						return true;
					} else {
						return false;
					}
				});

			let update = [];
			if (updateRule.length > 0 && updateRule[0].ruleContentList.length > 0) {
				update = updateRule[0].ruleContentList.map(item => {
					let updateItem = {
						configId: grade.id,
						title: (item.title || ''),
						condition: item.conditions.map(item => {
							return item.title;
						}),
						effectiveContentConfig: item.effectiveContentConfig,
						validity: DateCommon.timeToTitle(item),
						source: item
					};
					return updateItem;
				});
			}

			let keepingRule = ruleList.gradeRuleList.filter(rule => {
				if (grade.id === rule.configId && rule.ruleContentList && rule.ruleType === 'KEEPING') {
					return true;
				} else {
					return false;
				}
			});

			let keeping = [];
			if (keepingRule.length > 0 && keepingRule[0].ruleContentList.length > 0) {
				keeping = keepingRule[0].ruleContentList.map(item => {
					let keepingItem = {
						configId: grade.id,
						title: (item.title || ''),
						condition: item.conditions.map(item => {
							return item.title;
						}),
						effectiveContentConfig: item.effectiveContentConfig,
						validity: DateCommon.timeToTitle(item),
						source: item
					};
					return keepingItem;
				});
			}

			grade.ruleGroup = {
				update: update,
				keeping: keeping
			};
		});
		return grade;
	}

	clickTheSwitch() {
		if (this.setting.ruleEnabled) {
			if (this.showStartTime) {
				this._TipsService.showError('请先确定规则执行的时间');
				this.setting.ruleEnabled = false;
				return;
			}
			let modalInstance = this._$ccModal.confirm('请确认是否开启等级规则？', () => {
			});
			modalInstance.open().result.then(() => {
				this.switchGrade();
			}, () => {
				this.setting.ruleEnabled = false;
			});
		} else {
			let modalInstance = this._$ccModal.confirm('请确认是否关闭等级规则？', () => {
			});
			modalInstance.open().result.then(() => {
				this.switchGrade();
			}, () => {
				this.setting.ruleEnabled = true;
			});
		}

	}

	switchGrade() {
		Resources.GradesSwitchEnble.update({
			planId: DataManage.planId,
			gradeId: this.gradeId
		}, this.setting.ruleEnabled).$promise.then(() => {
			this._TipsService.showSuccess('操作成功');
		}, error => {
			this.setting.ruleEnabled = !this.setting.ruleEnabled;
			this._TipsService.showError('操作失败,原因:' + error.data.message);
		});

	}

	/**
	 * 生成请求参数
	 * @returns {*}
	 */
	generateRequestParam(open) {
		let gradeRuleList = [];
		this.rules.forEach(item => {

			let ruleContentList = item.ruleGroup.update.map(item => {
				return item.source;
			});
			let rule = {
				cardGradePlanId: this.gradeId,
				cardPlanId: DataManage.planId,
				configId: item.id,
				// id: 1,
				ruleContentList: ruleContentList,
				ruleType: 'UPGRADE'
			};
			(ruleContentList && ruleContentList.length !== 0) && gradeRuleList.push(rule);
			let ruleContentList2 = item.ruleGroup.keeping.map(item => {
				return item.source;
			});
			let rule2 = {
				cardGradePlanId: this.gradeId,
				cardPlanId: DataManage.planId,
				configId: item.id,
				// id: 1,
				ruleContentList: ruleContentList2,
				ruleType: 'KEEPING'
			};
			(ruleContentList2 && ruleContentList2.length !== 0) && gradeRuleList.push(rule2);
		});

		this.oldRuleList.gradeRuleList.forEach(itemOld => {
			gradeRuleList.forEach(item => {
				if (itemOld.configId === item.configId && itemOld.ruleType === item.ruleType) {
					item.id = itemOld.id;
				}
			});
		});
		this.oldRuleList.gradeRuleList = gradeRuleList;
		this.newRuleList = this.oldRuleList;
		this.timeSetting = {
			ruleEnabled: this.setting.ruleEnabled, // 当前规则是否启用
			// ruleRunDate: this.setting.startTime.hour + ':' + this.setting.startTime.second,
			unionRuleProperty: { // 统一的规则属性
				// id: 1, // 主键
				gradePropertyDateSectionName: this.rangType[0], // 属性的统计周期 可选值 ABSOLUTE | RELATIVE | FIX_RELATIVE
				unionRulePropertySectionConfig: { // 相应的周期配置时间
					fixDate: this._$filter('date')(this.absoluteTime, 'yyyy-MM-dd'), // 绝对时的开始时间 ABSOLUTE 时存在
					interval: this.rangType[0] === 'RELATIVE' ? this.relativeInterval[0] : this.fixRelativeInterval[0], // 相对统计周期的数字值 RELATIVE | FIX_RELATIVE 滚动统计时这里表示的是年
					intervalTimeUnit: this.rangType[0] === 'RELATIVE' ? this.relativeUnit[0] : 'YEAR', // 相对统计周期的单位值 RELATIVE | FIX_RELATIVE 滚动统计时这里只能为 YEAR
					fixValue: this.fixRelativeInterval[0] ? this.fixValue : '01-01'// 滚动的开始时间 格式 月-日 FIX_RELATIVE
				}
			}
		};
		open && (this.timeSetting.ruleNowEnabled = true);
		this.newRuleList = Object.assign(this.newRuleList, this.timeSetting);
		console.log('修改请求的对象是:');
		console.log(this.newRuleList);
		return this.newRuleList;
	}

	/**
	 * 转换规则有效期数据到字面量
	 */
	validDateUnit(validDateUnit) {
		switch (validDateUnit) {
			case 'MONTH':
				return '个月';
			case 'YEAR':
				return '年';
			default:
				return '未知';
		}
	}

	missError() {
		this.error && this.error.close();
	}

	/**
	 * 界面操作响应 ================================================
	 */

	save(open) {
		// if (this.showStartTime) {
		// 	this._TipsService.showError('请先确定规则执行的时间');
		// 	return;
		// }
		let modalInstance = this._$ccModal
			.confirm('请确认是否' + (open ? '保存并开启' : '保存') + `等级规则?`, () => { });

		modalInstance
			.open()
			.result
			.then(() => {
				this._$ccValidator.validate(this.basicInput).then(() => {
					this._$scope.$broadcast('nextStep');
					this._$timeout(() => {
						this.unModify(this.oldRuleList);
						let parme = this.SIMPLE ? this.generateRequestParam_Simple(open) : this.generateRequestParam(open);

						Resources.GradesRuleListesource
							.update({ planId: DataManage.planId, gradeId: this.gradeId }, parme)
							.$promise
							.then(result => {
								this._TipsService.showSuccess('操作成功');
								this.init();
							})
							.catch(error => {
								this._TipsService.showError('操作失败' + error.data.message);
								this.init();
							});
					});
				});
			}, () => {
			});
	}

	reset() {
		this.init();
	}

	/**
	 * 处理规则的 删除 编辑 新增
	 * @param operator 操作类型
	 * @param configId 被操作的等级ID
	 * @param levelRuleIndex 被操作的规则的index
	 * @param type 被操作规则的数据类型 升级或者保级
	 * @param arr 被操作的当前的数组
	 */
	ruleOperate(operator, rule, levelRuleIndex, type, arr) {
		let configId = rule.id;
		let targetRule = [];
		let title = '等级规则' + (arr.length + 1);
		console.log('operator, configId, levelRuleIndex, type, arr');
		console.log(operator, configId, levelRuleIndex, type, arr);
		this.showFloatBlock = false;
		switch (operator) {
			case 'up': // 上移动
				if (levelRuleIndex - 1 >= 0) {
					targetRule = arr.splice(levelRuleIndex, 1);
					arr.splice(levelRuleIndex - 1, 0, targetRule[0]);
				}
				break;
			case 'down': // 下移动
				if (levelRuleIndex + 1 < arr.length) {
					targetRule = arr.splice(levelRuleIndex + 1, 1);
					arr.splice(levelRuleIndex, 0, targetRule[0]);
				}
				break;
			case 'copy': // 复制
				targetRule = angular.copy(arr[levelRuleIndex]);
				targetRule.title = title;
				targetRule.source.title = title;
				arr.splice(levelRuleIndex + 1, 0, targetRule);
				break;
			case 'delete': // 删除
				arr.splice(levelRuleIndex, 1);
				break;
			case 'edit': // 编辑
				this.showFloatBlock = false;
				let editingRule = {
					configId: configId,
					type: type,
					levelRuleIndex: levelRuleIndex,
					allRules: this.rules,
					state: 'edit',
					oldRuleList: this.oldRuleList,
					gradeId: this.gradeId,
					setting: this.setting
				};
				console.log('editingRule', editingRule);
				this._$state.go('le.loyalty.levelruleConditionEdit', {
					editingLevelRule: editingRule,
					editingRule: angular.copy(editingRule),
					gradeId: this.gradeId
				});
				break;
			case 'new': // 新建
				this.showFloatBlock = false;

				editingRule = {
					configId: configId,
					type: type,
					levelRuleIndex: arr.length,
					allRules: this.rules,
					state: 'edit',
					oldRuleList: this.oldRuleList,
					gradeId: this.gradeId,
					setting: this.setting
				};
				let oldEditingRule = angular.copy(editingRule);
				arr.push({
					condition: ['准备编辑'],
					title: title,
					validity: '永久有效',
					source: {
						conditions: [],
						logic: 'AND',
						title: title,
						validDate: 1,
						validDateUnit: 'MONTH'
					}
				});
				this._$state.go('le.loyalty.levelruleConditionEdit', {
					editingLevelRule: editingRule,
					editingRule: oldEditingRule,
					gradeId: this.gradeId
				});
				break;
			default:
				break;
		}
	}

	/**
	 * 以下为浮动框相关的方法 ================================================
	 */
	mouseenterConditionTitle() {
		if (this.noShow) {
			return;
		}
		this.showFloatBlock = true;
	}

	// 给随动框赋值
	mousemoveConditionTitle(condition, e, conditions) {
		if (this.noShow) {
			return;
		}
		this.showing = {};
		this.showing.condition = condition;
		if (!condition.condition || condition.condition.length === 0) {
			this.showFloatBlock = false;
			return;
		}
		this.showing.rules = condition.condition.map(item => {
			return this._exDataService.logicalWordColor(item);
		}).join(' <br> ');
		this.showing.validity = condition.validity;
		conditions.forEach(condition => {
			condition.hover = false;
		});
		condition.hover = true;
		this.handlerMM(e, condition.condition.length);
		this.showFloatBlock = true;
	}

	// 鼠标离开规则的时候 随动消失
	mouseleaveConditionTitle(condition) {
		condition.hover = false;
		if (this.noShow) {
			return;
		}
		this.showFloatBlock = false;
		this.stop = false;
	}

	// 设置随动的
	handlerMM(e, line) {
		if (this.noShow) {
			return;
		}
		if (this.stop) {
			return;
		}
		console.log('计算');
		let x = e.pageX - 10;
		this.x = x < 220 ? 220 : x;
		let y = e.pageY;
		let height = window.innerHeight;
		let floatHeight = line * 19 + 98;
		this.y = ((y + floatHeight + 50) > height) ? (y - floatHeight + 5) : y;
	}

	// 停止随动
	stopFloat(e) {
		if (this.noShow) {
			return;
		}
		e.stopPropagation();
		this.showFloatBlock = true;
		this.stop = true;
		this.showing.condition.hover = true;

	}

	blockmouseleave() {
		this.showing.condition.hover = false;
	}

	floatBlockclick(e) {
		this.handlerMM(e);
		this.noShow = true;
		this.stop = false;
		this.showFloatBlock = false;
		this.showing.condition.hover = false;
	}
}
