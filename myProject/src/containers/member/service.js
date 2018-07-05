/**
 * Created by liwenjie on 2016/12/22.
 */

import {Inject} from 'angular-es-utils';
import Resource from '../../common/Resources';

@Inject('$ccTips', '$timeout', '$filter')
export default class MemberServices {
	constructor() {
	}

	/**
	 * 修改会员的元数据
	 * @param planId 计划ID
	 * @param memberId 会员ID
	 * @param metaMap 元数据
	 * @returns {*}
	 */
	putMemberMetas(planId, memberId, metaMap) {
		return Resource.MemberMetasEdit.update({planId: planId, memberId: memberId}, metaMap).$promise;
	}

	/**
	 * 修改会员的分数
	 * @param planId 店铺ID
	 * @param memberId 会员ID
	 * @param key 被修改的积分ID
	 * @param value 变更的值
	 * @param add 增加或减少
	 * @returns {*}
	 */
	putMemberPoint(planId, memberId, key, value, add) {
		const parm = {
			point: Number(value),
			desc: ''
		};
		if (add) {
			return Resource.MemberPointsGain.save({planId: planId, memberId: memberId, pointPlanId: key}, parm).$promise;
		} else {
			return Resource.MemberPointsDeduct.save({planId: planId, memberId: memberId, pointPlanId: key}, parm).$promise;
		}
	}

	/**
	 * 修改会员等级
	 * @param planId 店铺ID
	 * @param idValue 卡计划ID
	 * @param memberId 会员ID
	 * @param currentGradeId 等级ID
	 * @param currentOverdueDate 等级有效期, 不传则为永久有效
	 * @returns {*}
	 */
	putMemberGrade(planId, idValue, memberId, currentGradeId, longEffective, currentOverdueDate) {
		return Resource.MemberGradeEdit.save({planId}, {
			cardGradePlanId: idValue,
			memberId: memberId,
			gradeId: currentGradeId,
			overdueDate: longEffective ? undefined : (this._$filter('date')(currentOverdueDate, 'yyyy-MM-dd') || undefined)
		}).$promise;
	}
}
