/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */
import { Inject } from 'angular-es-utils';

import Resource from '../../../common/Resources.js';

import Tpl from './valids-setting.tpl.html';
import tipTpl from './tip.html';
import DataManage from '../../../common/DataManage';
import CommonCtrl from '../CommonCtrl';

import angular from 'angular';

@Inject('PublicService', '$scope', '$ccMenus', '$ccGrid', '$ccValidator', '$timeout', 'TipsService', '$q', '$ccModal')
export default class MemberCardsCtrl extends CommonCtrl {

	constructor() {
		super();
		this.memberDayWeekShow = true;
		this.selectList2 = [
			{ title: '当年', value: 0 },
			{ title: '1年后', value: 1 },
			{ title: '2年后', value: 2 },
			{ title: '3年后', value: 3 },
			{ title: '4年后', value: 4 },
			{ title: '5年后', value: 5 }
		];
		this._PublicService.onShopChange(this.init.bind(this), this);
		this.init();
	}

	init() {
		this.showContent = false;
		this.initBasicData();
		Resource.GradesResource.query({ planId: DataManage.planId }).$promise.then(
			gradeArr => {
				let grade = gradeArr[0];
				this.gradeId = grade.id;
				this.grade = grade;
				this.needShowSynchronousGrade = DataManage.allConfig.showSynchronousGrade && grade.platId;
				this.grades = gradeArr;
				this.initGrid1(gradeArr);
				this.initGrid2();
			}
		).catch();
	}

	// 基本数据
	initBasicData() {
		this.memberDayMonth = []; // 会员日-月
		this.memberDayWeek = []; // 会员日-周
		Resource.MemberCardsInfo.get({ planId: DataManage.planId }).$promise
			.then(data => {
				this.memberCardInfo = data;
				this.memberGradeUpdate_befor = angular.copy(data);
				data.memberDayList && data.memberDayList.forEach(item => {
					this._$timeout(() => {
						if (item.unit === 'MONTH') {
							this.memberDayMonth = item.days;
						} else if (item.unit === 'WEEK') {
							this.memberDayWeek = item.days;
						}
					}, 100);
				});
			});
		this.weeklist = [
			{ title: '周一', value: '1' },
			{ title: '周二', value: '2' },
			{ title: '周三', value: '3' },
			{ title: '周四', value: '4' },
			{ title: '周五', value: '5' },
			{ title: '周六', value: '6' },
			{ title: '周日', value: '7' }
		];
		this.integerMethods = [
			{ title: '向上取整', value: 'UP' },
			{ title: '向下取整', value: 'DOWN' },
			{ title: '四舍五入', value: 'ROUND' }
		];
		this.synchronous = [
			{ title: '不同步', value: undefined }
		];

		this.cyclelist = [
			{ title: '天', value: 1 },
			{ title: '月', value: 2 },
			{ title: '年', value: 3 }
		];
		this.cycle1 = '1';
		this.cycleValue = 2;
		this.cycleValue2 = 3;
		this.weekSelected = [];
		this.daySelected = [];
		this.valids = 3;
		this.holderMsg = '每月';
		this.days = [];
	}

	// 加载表格一的数据
	initGrid1(gradeArr) {
		if (!this.gradeId) {
			return;
		}
		gradeArr.forEach(grade => {
			let { id, caption } = grade;
			// 如果不需要同步平台等级信息, 则下拉框数据为空数组;
			const grid1DropdownPromise = this.needShowSynchronousGrade && Resource.GradesMGResource.query({ platId: this.grade.platId }).$promise || new Promise(resolve => resolve([]));
			const grid1DataPromise = Resource.MemberCardsSettingLevel.query({
				planId: DataManage.planId,
				gradeId: id
			}).$promise;
			this._$q.all([grid1DropdownPromise, grid1DataPromise]).then(([grid1DropdownData, grid1Data]) => {

				grid1DropdownData = grid1DropdownData.map(item => {
					return { title: item.caption, value: item.id, order: item.order };
				});
				grid1DropdownData.unshift({ title: '不同步', value: undefined, order: 9999 });
				this.synchronous = grid1DropdownData;

				grade.levelSettingObj = grid1Data;
				grade.levelSettingObj_before = {};
				grid1Data.forEach(item => {
					grade.levelSettingObj_before[item.id] = angular.copy(item);
				});
				grade.style = { height: `${(grid1Data.length + 1) * 43 + (grid1Data.length ? 0 : 86)}px` };
				this.drawLevelSetingGrid(grade);
			}).catch(error => {
				console.log(error);
				this._TipsService.showError(caption + '数据加载有误,请刷新重试', error.data.message);
			});
		});
	}

	// 加载表格二的数据
	initGrid2() {
		Resource.MemberCardsSettingPlantPoints.query({ planId: DataManage.planId }).$promise.then(data => {
			this.memberCardPoints = data;
			this.memberCardPoints_befor = {};
			data.forEach(item => {
				this.memberCardPoints_befor[item.id] = angular.copy(item);
			});
			this.drawPointsSettingGrid(this.memberCardPoints);
			this.pointsSettingGridOpts.style = { height: `${data.length * 149 + (data.length ? 44 : 84)}px` };
		});
	}

	// 绘制 等级设置表格
	drawLevelSetingGrid(grade) {
		grade.levelSettingObj.forEach((item, index) => {
			item.lvIndex = index;
		});

		grade.opts = {
			externalData: grade.levelSettingObj,
			showPagination: false,
			columnsDef: [{
				field: 'title',
				displayName: grade.caption,
				align: 'left',
				cellTemplate: '<span>Lv.{{entity.lvIndex}}</span>'
			}, {
				displayName: '等级名称',
				align: 'left',
				cellTemplate: '<input type="text" class="input-medium" ng-model="entity.caption" placeholder="请输入等级名称" cc-validator required required-msg="请输入1-5个字" maxlength="5">'
			}, {
				field: 'baodi',
				displayName: '是否保底',
				align: 'left',
				cellTemplate: '<cc-checkbox ng-disabled="!entity.bottomModifiable" ng-model="entity.bottom" ng-click="$ctrl.tipBottom(entity)">启用保底</cc-checkbox>'
			}],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">暂无数据</div>'
		};
		if (this.needShowSynchronousGrade) {
			grade.opts.columnsDef.push({
				displayName: '同步等级信息',
				align: 'left',
				cellTemplate: '<span ng-show="entity.lvIndex === 0">潜客无需同步</span>' +
				'<cc-dropdown-select ng-show="entity.lvIndex !== 0"' +
				'class="dropdown"' +
				'model="entity.syncPlatGradeId"' +
				'datalist="$ctrl.synchronous">' +
				'	</cc-dropdown-select>'
			});
		}
		this.showContent = true;
		this._$ccGrid.refresh(grade.opts);
	}
	tipBottom(entity) {
		if (entity.bottom) {
			const modalInstance = this._$ccModal
				.modal({
					title: '提示',
					body: tipTpl,
					entity: entity,
					controller: TipCtrl,
					style: {
						'min-width': '450px',
						'width': '450px',
						'height': '74px',
						'min-height': '74px'
					},
					bindings: {
						entity: entity
					}
				}).open();
			modalInstance.result.then(() => {
				entity.bottom = true;
			}, () => {
				entity.bottom = false;
			});
		}
	}

	// 绘制 积分设置表格
	drawPointsSettingGrid(data) {
		this.pointsOverdue();
		data.forEach(item => {
			const caption = item.viewCaption;
			item.viewCaption = item.gatherCaption || item.viewCaption;
			item.pointCaptionTitle = item.gatherCaption ? `${DataManage.allConfig.unitViewCaption || '店铺'}积分名称:` + caption + '\n集团卡积分名称:' + item.gatherCaption : item.pointCaption;
		});
		this.pointsSettingGridOpts = {
			externalData: data,
			showPagination: false,
			columnsDef: [{
				displayName: '积分名称',
				align: 'left',
				cellTemplate: '<input class="inputPointName" type="text" ng-model="entity.viewCaption" placeholder="请输入积分名称" ng-disabled="entity.gatherCaption" cc-validator title="{{entity.pointCaptionTitle}}" required required-msg="请输入1-5个字" maxlength="5">',
				width: '200px'
			}, {
				displayName: '取整方式',
				align: 'left',
				cellTemplate: '<cc-dropdown-select class="int-type"' +
				'model="entity.roundType"' +
				'datalist="$ctrl.integerMethods">' +
				'	</cc-dropdown-select>',
				width: '200px'
			}, {
				field: 'baodi',
				displayName: '积分有效期',
				align: 'left',
				cellTemplate: Tpl
			}],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">暂无数据</div>'
		};
		this.showContent = true;
		this._$ccGrid.refresh(this.pointsSettingGridOpts);
	}

	/**
	 * 积分有效期数据处理
	 */
	pointsOverdue() {
		this.memberCardPoints.forEach(item => {
			item.cycle1 = 1;
			item.everyInterval = 180;
			item.unifiedInterval = [1];
			item.overdueStrategyConfig = item.overdueStrategyConfig || {};
			item.overdueStrategyConfig.fixValue = item.overdueStrategyConfig && item.overdueStrategyConfig.fixValue || '12-31';
			switch (item.overdueStrategyName || 'NEVER') {
				case 'NEVER':
					item.valids = 4;
					break;
				case 'EVERY':
					item.valids = 2;
					item.everyInterval = item.overdueStrategyConfig && item.overdueStrategyConfig.interval;
					if (item.overdueStrategyConfig && item.overdueStrategyConfig.intervalTimeUnit === 'YEAR') {
						item.cycle1 = 3;
					} else if (item.overdueStrategyConfig && item.overdueStrategyConfig.intervalTimeUnit === 'MONTH') {
						item.cycle1 = 2;
					} else if (item.overdueStrategyConfig && item.overdueStrategyConfig.intervalTimeUnit === 'DAY') {
						item.cycle1 = 1;
					}
					break;
				case 'UNIFIED':
					item.valids = 3;
					item.unifiedInterval = item.overdueStrategyConfig && [item.overdueStrategyConfig.interval] || [0];
					// }
					break;
				default:
					item.valids = 4;
					break;

			}
		});
	}

	/**
	 * 数据组装
	 */
	dataAssemble() {
		// 等级修改数据
		this.memberGradeUpdate = {
			id: this.memberCardInfo.id || '',
			caption: this.memberCardInfo.caption,
			memberDayList: []
		};
		this.memberGradeUpdate.memberDayList.push({
			unit: 'MONTH',
			days: this.memberDayMonth
		}, {
				unit: 'WEEK',
				days: this.memberDayWeek
			});

		// 积分修改数据
		this.memberPointsUpdate = [];
		this.memberCardPoints.length > 0 && this.memberCardPoints.forEach(item => {
			this.memberPointsUpdate.push({
				id: item.id,
				viewCaption: item.viewCaption,
				postfix: item.viewCaption,
				roundType: item.roundType
			});
		});

		// 积分有效期修改数据
		this.pointsOverdueUpdate = [];
		this.memberCardPoints.length > 0 && this.memberCardPoints.forEach(item => {
			switch (item.valids) {
				case 1:
					this.pointsOverdueUpdate.push({
						id: item.id,
						overdueStrategyName: 'UNIFIED',
						overdueStrategyConfig: {
							interval: 0,
							intervalTimeUnit: 'YEAR',
							fixValue: '12-31'
						}
					});
					break;
				case 2:
					let unit = 'DAY';
					if (item.cycle1 === 2) {
						unit = 'MONTH';
					} else if (item.cycle1 === 3) {
						unit = 'YEAR';
					}
					this.pointsOverdueUpdate.push({
						id: item.id,
						overdueStrategyName: 'EVERY',
						overdueStrategyConfig: {
							interval: item.everyInterval,
							intervalTimeUnit: unit
						}
					});
					break;
				case 3:
					this.pointsOverdueUpdate.push({
						id: item.id,
						overdueStrategyName: 'UNIFIED',
						overdueStrategyConfig: {
							interval: item.unifiedInterval[0],
							intervalTimeUnit: 'YEAR',
							fixValue: item.unifiedInterval[0] ? item.overdueStrategyConfig.fixValue : '12-31'
						}
					});
					break;
				case 4:
					this.pointsOverdueUpdate.push({
						id: item.id,
						overdueStrategyName: 'NEVER',
						overdueStrategyConfig: {}
					});
					break;
			}
		});
	}

	isMemberGradeUpdateNew() {
		if (this.memberGradeUpdate_befor.caption !== this.memberGradeUpdate.caption) {
			return true;
		}
		if (this.memberGradeUpdate_befor.memberDayList) {
			if (this.memberGradeUpdate_befor.memberDayList[0].days.join(',') !== this.memberGradeUpdate.memberDayList[0].days.join(',')) {
				return true;
			}
			if (this.memberGradeUpdate_befor.memberDayList[1].days.join(',') !== this.memberGradeUpdate.memberDayList[1].days.join(',')) {
				return true;
			}
		} else {
			return true;
		}
		return false;
	}

	save() {
		if (this.memberDayWeekIsOpen || this.memberDayMounthIsOpen) {
			this._TipsService.showError('请先确认会员日');
			return;
		}
		this._$ccValidator.validate(this.memberCardsForm).then(() => {
			this.dataAssemble();
			let arr = [];
			if (this.isMemberGradeUpdateNew()) {
				const memberCardInfoPromise = Resource.MemberCardsInfo.update({ planId: DataManage.planId }, this.memberGradeUpdate).$promise;
				arr.push(memberCardInfoPromise);
			}
			this.grades.forEach(grade => {
				let after = grade.levelSettingObj.filter(item => {
					let old = grade.levelSettingObj_before[item.id];
					if (this.needShowSynchronousGrade) {
						return old.caption !== item.caption || old.syncPlatGradeId !== item.syncPlatGradeId || old.bottom !== item.bottom;
					} else {
						return old.caption !== item.caption || old.bottom !== item.bottom;
					}
				});
				const levelSettingPromise = after.map(item =>
					Resource.GradesConfigModifyResource.update({
						planId: DataManage.planId,
						gradeId: item.cardGradePlanId,
						configId: item.id
					}, item).$promise);
				arr = arr.concat(levelSettingPromise);
			});
			let memberPointsUpdate_after = this.memberPointsUpdate.filter(item => {
				let old = this.memberCardPoints_befor[item.id];
				let result = ['viewCaption', 'roundType', 'postfix'].some(po => {
					return old[po] !== item[po];
				});
				return result;
			});
			const memberCardPointsPromise = memberPointsUpdate_after.map(item =>
				Resource.RulesNameResource.update({
					planId: DataManage.planId,
					pointId: item.id
				}, item).$promise);
			arr = arr.concat(memberCardPointsPromise);
			let pointsOverdueUpdate_after = this.pointsOverdueUpdate.filter(item => {
				let old = this.memberCardPoints_befor[item.id];
				return ['overdueStrategyName'].some(po => old[po] !== item[po]) ||
					['interval', 'intervalTimeUnit', 'fixValue'].some(po => !old.overdueStrategyConfig || old.overdueStrategyConfig[po] !== item.overdueStrategyConfig[po]);
			});
			const pointsOverduePromise = pointsOverdueUpdate_after.map(item =>
				Resource.PointsOverDueResource.update({
					planId: DataManage.planId,
					pointId: item.id
				}, item).$promise);
			arr = arr.concat(pointsOverduePromise);
			if (arr.length === 0) {
				this._TipsService.showSuccess('您没有做任何修改');
				return;
			} else {
				this.showContent = false;
			}
			this._$q.all(arr)
				.then(data => {
					this.init();
					this._TipsService.showSuccess('操作成功');
				})
				.catch(error => {
					this._TipsService.showError(error.data.message || '未知错误');
				});
		}, () => {
			// document.querySelector('#cardName').focus();
		});
	}

	cancel() {
		this.init();
	}

	closeTheMemberDayWeek(e) {
		let positioning = document.getElementById('positioning');
		if (positioning) {
			let y = this.getElementTop(positioning);
			let x = this.getElementLeft(positioning);
			const arry = [].concat(this.memberDayWeek);
			let cancelBtnContainer = document.getElementsByClassName('dropdown-multiselect ng-isolate-scope dropdown dropdown-opened');
			let cancelBtn = document.getElementsByClassName('btn-cancel-normal');
			if (cancelBtnContainer.length > 0 && cancelBtn.length > 0 && (e.x > (x + 240) || e.y < y || e.x < x || e.y > (y + 290))) {
				this.memberDayWeekShow = false;
				this._$timeout(() => {
					this.memberDayWeekShow = true; // 呵呵~~ 感觉这是最省心的办法, 没有找到更好的解决办法了 (升级组件后,其他地方有BUG)
					this._$timeout(() => {
						this.memberDayWeek = arry; // 找回被干掉的值
					}, 0);
				}, 0);
			}
		}
	}
	getElementTop(element) {
		let actualTop = element.offsetTop;
		let current = element.offsetParent;

		while (current !== null) {
			actualTop += current.offsetTop;
			current = current.offsetParent;
		}
		return actualTop;
	}
	getElementLeft(element) {
		let actualLeft = element.offsetLeft;
		let current = element.offsetParent;
		while (current !== null) {
			actualLeft += current.offsetLeft;
			current = current.offsetParent;
		}
		return actualLeft;
	}
}

class TipCtrl {
	constructor() { }
}
