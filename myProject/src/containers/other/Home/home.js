/**
 * Created by liwenjie on 2017/2/22.
 */
import {Inject} from 'angular-es-utils';
import DataManage from '../../../common/DataManage';

@Inject('$state', '$ccMenus')
export default class Home {
	constructor() {
		this._$ccMenus.getCurrentPlatShop().then(data => { // 获取卡计划ID 和卡计划名称
			return data.plat.name;
		}).then(name => {
			setTimeout(() => {
				this.jumpToDefaultState(name);
			}, 1000);
		});
	}

	jumpToDefaultState(name) {
		let router_card = DataManage.isPermit('MG0100') ? 'le.groupCard.setting' : 'le.groupCard.point';
		let router_shop = DataManage.isPermit('MG0310') ? 'le.member.information' : 'le.member.pointsRecords';
		name === '集团卡' ? this._$state.go(router_card) : this._$state.go(router_shop);
	}
}
