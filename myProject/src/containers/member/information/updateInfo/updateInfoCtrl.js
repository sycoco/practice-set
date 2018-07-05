/**
 * Created by qiuzhi.zhu on 2016/11/7.
 */

import { Inject } from 'angular-es-utils';
import Resource from '../../../../common/Resources.js';
import { DateCommon } from '../../../../common/utils';
import angular from 'angular';

@Inject('$q', '$ccValidator', 'modalInstance', 'MemberServices', 'TipsService', '$filter')
export default class UpdateInfoCtrl {

	constructor() {
		this.showLoading = true;
		this.initBasicData();
		const str = JSON.stringify({includeMeta: true, includeGrade: true, includePoint: true});
		Resource.MemberInfoPlan.get({planId: this.planId, memberId: this.memberId, param: str}).$promise
			.then(data => {
				this.metaValue(this.metaMemberArray, data);
				this.gradeValue(this.memberGradePlan, data.gradeList);
				this.pointValue(this.memberPointPlan, data.pointList);
				this.showLoading = false;
			});
	}
	initBasicData() {
		this.datalist = [
			{title: '增加', value: 'add'},
			{title: '减少', value: 'sub'}
		];
		this.validators = {
			mobilePhone: {
				msg: '请输入正确的手机号！',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue;
					return value ? /^1[34578]\d{9}$/.test(value) : true;
				}
			},
			email: {
				msg: '请输入正确的邮箱！',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue;
					return value ? /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value) : true;
				}
			}
		};
		this.gradeEffectiveMinDate = new Date(new Date().setHours(0, 0, 0, 0));
	}

	/**
	 * 等级数据处理
	 * @param gradeConfigs 可配置的等级数据
	 * @param memberGradeList 会员的等级列表
	 */
	gradeValue(gradeConfigs, memberGradeList) {
		this.gradeList = [];
		gradeConfigs.forEach(config => {
			this.gradeList.push({
				caption: config.displayName,
				idValue: config.idValue,
				gradeListOptions: config.options.slice(1),
				currentGradeId: config.options.length > 1 ? config.options.slice(1)[0].value : '',
				currentOverdueDate: undefined,
				longEffective: true
			});
		});

		memberGradeList.forEach(memberGrade => {
			let gradeConfig = this.gradeList.filter(grade => {
				return grade.idValue === memberGrade.cardGradePlanId;
			});
			if (gradeConfig[0]) {
				(gradeConfig[0].currentGradeId = memberGrade.currentGradeId);
				gradeConfig[0].currentOverdueDate = (memberGrade.currentOverdueDate && new Date(memberGrade.currentOverdueDate)) || undefined;
				gradeConfig[0].currentOverdueDate && (gradeConfig[0].longEffective = false, gradeConfig[0].oldlongEffective = false);
			}
		});
	}

	/**
	 * 积分数据处理
	 * @param pointConfigs 可配置的积分数据
	 * @param memberPointList 会员的积分数据
	 */
	pointValue(pointConfigs, memberPointList) {
		this.valueArray = [];
		this.memberPoint = {};
		memberPointList.forEach(item => {
			if (pointConfigs[item.cardPointPlanId]) {
				this.memberPoint[pointConfigs[item.cardPointPlanId]] = item.currentValidPoint;
			}
		});
		for (let key in pointConfigs) {
			this.valueArray.push({
				key: key,
				title: pointConfigs[key],
				type: 'add',
				value: ''
			});
		}
	}

	/**
	 * 元数据处理
	 * @param gradeConfigs
	 * @param memberGradeList
	 */
	metaValue(metaConfigs, memberMetaList) {
		this.memberInfo = memberMetaList;
		this.memberArray = [];
		metaConfigs.forEach(item => {
			if (item.metaAttr) {
				if (item.viewType === 'DATE') {
					this.memberInfo.metaMap[item.name] = DateCommon.isDate(this.memberInfo.metaMap[item.name]) ? new Date(this.memberInfo.metaMap[item.name]) : '';
				}
				this.memberArray.push({
					disable: !item.edited,
					displayName: item.caption,
					keys: [item.name],
					values: [this.memberInfo.metaMap[item.name] || ''],
					viewType: item.viewType
				});
			}
		});
	}

	/**
	 *  update 会员信息
	 */
	ok() {
		this._$ccValidator.validate(this.memberEdit).then(() => {
			// this.showLoading = true;
			console.log('校验成功!');
			// put会员元数据
			let MemberMetasEditPromise = [];
			this.memberMetaData();
			if (this.checMemberInfoIsNew(this.oldMemberInfo, this.memberInfo.metaMap)) {
				MemberMetasEditPromise = [this._MemberServices.putMemberMetas(this.planId, this.memberId, this.memberInfo.metaMap)];
			}
			// put会员积分
			let MemberPointsGainDeductPromise = [];
			let array = this.valueArray.filter(item => item.value);
			MemberPointsGainDeductPromise = MemberPointsGainDeductPromise.concat(array.map(item => {
				return this._MemberServices.putMemberPoint(this.planId, this.memberId, item.key, item.value, item.type === 'add');
			}));
			// 修改会员等级
			let MemberGradeEditPromise = [];
			this.gradeList.forEach(grade => {
				if (grade.oldCurrentGradeId !== grade.currentGradeId || grade.oldCurrentOverdueDate !== grade.currentOverdueDate || grade.oldlongEffective !== grade.longEffective) {
					MemberGradeEditPromise.push(this._MemberServices.putMemberGrade(this.planId, grade.idValue, this.memberId,
						grade.currentGradeId,
						grade.longEffective,
						grade.currentOverdueDate));
				}
			});
			let all = [...MemberMetasEditPromise, ...MemberGradeEditPromise, ...MemberPointsGainDeductPromise];
			if (all.length === 0) {
				this._modalInstance.cancel();
			} else {
				this._$q.all(all)
				.then(data => {
					this._TipsService.showSuccess('修改成功');
					this._modalInstance.ok();
				})
				.catch(() => {
					// this.showLoading = false;
					// this._TipsService.showError('修改失败', true);
				});
			}
		}, () => {
			console.log('校验失败!');
		});
	}

	/**
	 * 判断会员基本信息是否被更改
	 * @param oldJson 最开始的信息
	 * @param newObj 最新的对象
	 * @returns {boolean} true则表示修改过, 否则就是未修改
	 */
	checMemberInfoIsNew(old, newObj) {
		if (this.old === {}) {
			for (let key in newObj) {
				if (newObj[key] !== '' && newObj[key] !== undefined) {
					return true;
				}
			}
			return false;
		}
		let result = !angular.equals(old, newObj);
		return result;
	}
	/**
	 *  数据处理
	 */
	memberMetaData() {
		this.memberArray.forEach(item => {
			if (item.viewType === 'DATE') {
				this.memberInfo.metaMap[item.keys[0]] = this._$filter('date')(item.values[0], 'yyyy-MM-dd') || undefined;
			} else {
				this.memberInfo.metaMap[item.keys[0]] = item.values[0];
			}
		});
	}

}
