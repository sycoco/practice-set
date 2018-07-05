/**
 * Created by liwenjie on 2016/12/17.
 */

import {Inject} from 'angular-es-utils';
import Resources from '../../common/Resources';
import DataManage from '../../common/DataManage';

@Inject('$ccTips', '$timeout')
export default class GroupCardServices {
	constructor() {
	}

	/**
	 * 获取所有积分计划
	 * @param id 卡计划ID
	 * @returns {*}
	 */
	getPointPlanList(id) {
		return Resources.GroupCardPointPlantList_GET.query({cardId: id}).$promise;
	}

	/**
	 * 获取所有店铺积分计划和卡计划的绑定关系列表
	 * @param id
	 * @param data 所有店铺
	 * @returns {*}
	 */
	getShopAndPointBindList(id, data, allData) {
		return Resources.GroupCardPointPlantBindCardPlant_GET.query({cardId: id}).$promise.then(bindList => {
			console.log('bindList');
			console.log(bindList);
			let otherShop = allData.filter(item => item.id !== id);
			data.forEach(shop => {
				shop.pointPlanList.forEach(pointPlant => {
					bindList.forEach(bind => {
						if (bind.pointPlanId === pointPlant.id) {
							pointPlant.gatherPointPlanId = bind.gatherPointPlanId;
							shop.haveBindData = true;
							shop.selected = true;
						}
					});
					otherShop.forEach(item => {
						item.pointGatherList.forEach(bind => {
							if (bind.pointPlanId === pointPlant.id) {
								shop.disable = true;
								shop.hasBindCardCaption = item.caption;
							}
						});
					});
				});
			});
			return data.filter(item => item.haveBindData);
		});
	}

	/**
	 * 修改该卡计划下的:
	 * @param capiton 名称
	 * @param pointPlanList 积分名称
	 * @param gatherConfigList 积分绑定店铺关系
	 * @param id 卡计划ID
	 * @returns {*|Function}
	 */
	putShopAndPointBindList(caption, pointPlanList, gatherConfigList, id) {
		let parms = {
			caption,
			pointPlanList,
			gatherConfigList
		};
		return Resources.GroupCardPointPlantBindCardPlant_PUT.update({cardId: id}, parms).$promise;
	}

	/**
	 * 获取该租户下所有店铺的积分计划
	 * @returns {*}
	 */
	getShopList() {
		return Resources.GroupCardAllPointRule_GET.query().$promise.then(data => {
			data.forEach(item => {
				if (!item.pointPlanList || item.pointPlanList.length === 0) {
					item.pointPlanList = [{viewCaption: `该${DataManage.allConfig.unitViewCaption || '店铺'}没有配置积分`, id: null}];
					item.pointPlanList.noData = true;
				}
			});
			return data;
		});
	}
	getAllShopAndPointBindList() {
		return Resources.GroupCardAllPointPlantBindCardPlant_GET.query().$promise;
	}

	/**
	 * 返回该卡计划下的所有店铺列表
	 * @param cardId
	 * @returns {*|Promise.<TResult>}
	 */
	getAllShopByCardId(cardId) {
		return this.getAllShopAndPointBindList().then(data => {
			let temp = data.filter(item => item.id === cardId)[0].pointGatherList;
			temp = temp.reduce((a, b) => {
				a.push(b.unit);
				return a;
			}, []);
			return temp;
		});
	}
}
