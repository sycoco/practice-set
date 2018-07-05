/**
 * Created by zhouxing on 2016/10/31.
 */

import Resources from './Resources';

export default class DataManage {

	// 三维数组结构,以, planID gradesID configs
	// 如 : {12:{34:[]}}
	static allGradeConfig = {};

	static planId = undefined;

	static allConfig = {};

	static currentCtrl;

	static menuForPointsRules = {};

	static jurisdiction = {};
	static $STATEPROVIDER_POINTSRULES = {};
	static $STATEPROVIDER_LEVEL = {};
	static levels = {};

	/*
	* 使用场景是 切换店铺ID时，派发当前界面的使用到planId的接口
	* 该方法是： 切换店铺ID注册planId 和 调用controller constructor方法注册当前scope
	* 存在时， 调用当前controller的scope的initConfigInfo方法重新加载相关的配置信息资源
	* 不存在时，走else 方法
	*  */
	static setDataInfo(_value, _key) {
		DataManage[_key] = _value;
		// if (DataManage.currentCtrl && DataManage.planId) {
		// 	typeof DataManage.currentCtrl.initConfigInfo === 'function' && DataManage.currentCtrl.initConfigInfo();
		// } else {
		// }
	}
	static configMenuData(id) {
		return Resources.MenuPointsResource.query({planId: id}).$promise.then(data => {
			return data.map(item => {
				DataManage.menuForPointsRules[item.schemaTypeName] = {name: (item.caption || '未命名') + '送积分', state: 'le.loyalty.' + item.schemaTypeName};
				return {
					name: (item.caption || '未命名') + '送积分',
					state: 'le.loyalty.' + item.schemaTypeName,
					icon: '',
					children: []
				};
			});
		});
	}

	static QueryShops() {
		return Resources.ShopResource.query().$promise;
	}
	static QueryCards() {
		return Promise.resolve([]);
		// return Resources.CardListResource.query().$promise;
	}

	static GetPlanId(platId) {
		return Resources.PlanResource.get({unitId: platId}).$promise;
	}
	static isPermit(key) {
		if (!key) return false;
		return !!DataManage.jurisdiction[key];
	}
	static QueryMenus() {
		return Resources.MenuResource.query().$promise;
	}
}
