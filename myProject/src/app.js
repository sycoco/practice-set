/**
 * Created by liwenjie on 2017/1/11.
 */
import { Inject } from 'angular-es-utils';
import DataManage from './common/DataManage';
import './assets/css/basic.scss';
import angular from 'angular';
import Resources from './common/Resources';

import pointsEvaluationRulesTplUrl from './containers/loyalty/points-rules/points-rules.html';
import pointsEvaluationRulesCtrl from './containers/loyalty/points-rules/pointsRulesCtrl';

import TplUrl from './containers/loyalty/level-rules/level-rules.html';
import Ctrl from './containers/loyalty/level-rules/LevelRulesCtrl';

@Inject('PublicService', '$scope', '$ccMenus', 'TipsService', '$q', '$timeout', '$state', '$http')
export default class LEMainController {
	constructor() {
		this._$q.all([
			DataManage.QueryCards(),
			DataManage.QueryShops(),
			DataManage.QueryMenus()
		])
			// 获得所有的集团卡列表和店铺列表
			.then(result => {
				let data = result[1];
				sessionStorage.shopId = sessionStorage.shopId || (result[0][0] && result[0][0].id) || (result[1][0] && result[1][0].id);
				sessionStorage.shopType = sessionStorage.shopType || (result[0][0] && '集团卡') || (result[1][0] && '淘宝');
				this.shopList = data;
				this.cardList = result[0];
				this.menus = result[2];
				return { id: sessionStorage.shopId, type: sessionStorage.shopType }; // 店铺缓存 但页面上不会有表现
			})
			// 获得当前选择的ID 和 当前类型(卡/店铺)
			.then(({ id, type }) => {
				this._PublicService.shopId = id;
				return type === '集团卡' ? { planId: id } : DataManage.GetPlanId(id);
			})
			// 获得当前的卡计划ID
			.then(plan => {
				this._PublicService.planId = plan.planId;
				DataManage.setDataInfo(plan.planId, 'planId');
				return this._$q
					.all([this.loadspecialConfigRouter(), this._PublicService.getAllConfig()])
					.then(([router, showPermissionList]) => {
						this.router = router;
						return showPermissionList;
					});
			})
			.then(showPermissionList => {
				return this._PublicService.jurisdictionResource(showPermissionList);
			})
			// 获得所有的权限列表
			.then(jurisdiction => {
				this.jurisdiction = jurisdiction;
				if (jurisdiction || ['zcd.fenxibao.com', 'le.fenxibao.com', 'le2.fenxibao.com'].some(item => item === location.hostname)) return DataManage.configMenuData(this._PublicService.planId);
			})
			// 配置动态菜单
			.then(pointMenu => {
				if (pointMenu) {
					this.pointMenu = pointMenu;
					if (!DataManage.isPermit('MG0100') && !DataManage.isPermit('MG0200')) {
						this.cardList.length = 0;
					}
					this.list = this.cardList.length === 0 ? [
						mapShopResource(this.shopList, DataManage.allConfig.platCaption)
					] : [
						cardGroupsResource(this.cardList)]
						.concat([
							mapShopResource(this.shopList, DataManage.allConfig.platCaption)
						]);
					this.setCurrentShope(sessionStorage.shopId, sessionStorage.shopType);
					this.menusOptions = {
						unfold: true,
						unfoldClick: null,
						onUnfold: () => {
							// 搜索框的 展开 和收起的隐藏 需要onresize调用
							window.onresize();
						},
						menusResource: this.menuResource(this.pointMenu, this.router.levelMenu, sessionStorage.shopType, this.jurisdiction),
						shopsResource: this.list,
						searchPlaceholder: `请输入${DataManage.allConfig.unitViewCaption || '店铺'}名称`
					};
					this.shopChangeEvent();
					this._$scope.$on('$destroy', () => {
						this.shopChange();
					});
				}
				if (+sessionStorage.changeShopRefresh) {
					window.location.hash = sessionStorage.hash;
					sessionStorage.changeShopRefresh = 0;
				}
			});
		this.initConfig();
	}
	initConfig() {
		// 为了解决表格的初次搜索的问题 gird组件的emptyTipTpl不支持二次配置
		window.QUERY_FILTER_SEARCH_BTN_CLICK = () => {
			let elm = angular.element(document.querySelector('#query-filter-search-btn'));
			elm && elm[0] && (elm[0].click());
		};
	}
	// 加载动态路由配置:
	loadspecialConfigRouter() {
		return this._$q.all([
			Resources.MenuAllPointsResource.query().$promise,
			Resources.GradesResource.query({ planId: this._PublicService.planId }).$promise
		])
			.then(([point, level]) => {
				point.map(item => {
					DataManage.menuForPointsRules[item.schemaTypeName] = {
						name: item.caption,
						state: 'le.loyalty.' + item.schemaTypeName
					};
					return {
						name: item.caption || '未命名送积分规则',
						state: 'le.loyalty.' + item.schemaTypeName,
						schemaTypeName: item.schemaTypeName,
						icon: '',
						children: []
					};
				}).forEach(item => {
					const router = {
						url: '/' + item.schemaTypeName,
						params: {
							pointRule: null,
							pointIndex: null
						},
						templateUrl: pointsEvaluationRulesTplUrl,
						controller: pointsEvaluationRulesCtrl,
						controllerAs: '$ctrl'
					};
					const routerState = 'le.loyalty.' + item.schemaTypeName;
					// 查找ui-router 中state中是否存在，若不存在则注册
					!this._$state.get(routerState) && DataManage.$STATEPROVIDER_POINTSRULES.state(routerState, router);
				});
				DataManage.levels = level;
				level.forEach(item => {
					const router = {
						url: '/level-rules/' + item.id,
						templateUrl: TplUrl,
						controller: Ctrl,
						controllerAs: '$ctrl'
					};
					const routerState = 'le.loyalty.levelRules-' + item.id;
					// 查找ui-router 中state中是否存在，若不存在则注册
					!this._$state.get(routerState) && DataManage.$STATEPROVIDER_LEVEL.state(routerState, router);
				});
				const levelMenu = level.map(item => {
					return {
						name: item.caption,
						state: 'le.loyalty.levelRules-' + item.id,
						icon: '',
						children: [],
						permissionKey: 'MG0420'
					};
				});
				return {
					point,
					levelMenu
				};
			});
	}
	setCurrentShope(id, type) {
		try {
			this.list.forEach(item => {
				item.active = false;
				item.child && item.child.forEach(item => {
					item.active = false;
				});
			});
			if (id && type) {
				let listArry = this.list.filter(item => item.name === type)[0];
				if (listArry.child.length > 0) {
					listArry.active = true;
					let current = listArry.child.filter(item => item.id + '' === id + '');
					if (current.length > 0) {
						current[0].active = true;
					}
				}
			} else {
				this.list[0] && (this.list[0].active = true);
				this.list[0].child[0] && (this.list[0].child[0].active = true);
			}
		} catch (error) {
			console.log('error');
			console.log(error);
		}
	}
	shopChangeEvent() {
		this.shopChange = this._$ccMenus.onShopChange(current => {
			console.log(`切换了${DataManage.allConfig.unitViewCaption || '店铺'}=>` + current.shop.caption);
			this._TipsService.closeAll();
			sessionStorage.shopId = current.shop.id;
			if (current.plat.name !== sessionStorage.shopType) { // 如果 切换了一级菜单 （集团卡、店铺）
				this.setCurrentShope(current.shop.id, current.plat.name);
				this.menusOptions = null;
				this._$timeout(() => {
					this.menusOptions = {
						unfold: true,
						unfoldClick: null,
						onUnfold: () => {
							// 搜索框的 展开 和收起的隐藏 需要onresize调用
							window.onresize();
						},
						menusResource: this.menuResource(this.pointMenu, this.router.levelMenu, current.plat.name),
						shopsResource: this.list,
						searchPlaceholder: `请输入${DataManage.allConfig.unitViewCaption || '店铺'}名称`
					};
					jumpToDefaultState.call(this, current.plat.name);
				}, 0);
			}
			sessionStorage.shopType = current.plat.name;
			DataManage.GetPlanId(current.shop.id).then(plan => {
				DataManage.setDataInfo(plan.planId, 'planId');
				this._PublicService.planId = plan.planId;
				// this._PublicService.callBackPool.forEach(item => {
				// 	typeof item === 'function' && item();
				// }); // TODO: 删除相关代码
				// changeShopRefresh 为1 是店铺切换刷新
				sessionStorage.changeShopRefresh = 1;
				sessionStorage.hash = window.location.hash;
				window.location.reload();
			}, error => {
				this._TipsService.showError(JSON.parse(error.data.planId).message || '未知错误');
			});
		});
		function jumpToDefaultState(name) {
			let router_card = DataManage.isPermit('MG0100') ? 'le.groupCard.setting' : 'le.groupCard.point';
			let router_shop = DataManage.isPermit('MG0310') ? 'le.member.information' : 'le.home';
			name === '集团卡' ? this._$state.go(router_card) : this._$state.go(router_shop);
		}
	}
	menuResource(pointMenu, levelMenu, shopType = '集团卡') {
		let menu = [];
		if (shopType === '集团卡') {
			menu = this.menus.filter(item => {
				return item.code.indexOf('newloyalty.groupCard') > -1;
			});
			// menu = menu.filter(item => {
			// 	return DataManage.isPermit(item.permissionKey);
			// });
		} else {
			menu = this.menus.filter(item => {
				return item.code.indexOf('newloyalty.groupCard') === -1;
			});
			menu.forEach(item => {
				if (item.code === 'newloyalty.shop.manage') {
					item.children = item.children.concat(...levelMenu);
					item.children = item.children.concat(pointMenu);
				}
			});

			// menu = menu.filter(item => {
			// 	return DataManage.isPermit(item.permissionKey);
			// });
			// menu.forEach(items => {
			// 	items.children = items.children.filter(item => {
			// 		return DataManage.isPermit(item.permissionKey);
			// 	});
			// });
			// menu[1].children = menu[1].children.concat(pointMenu);
		}

		return menu;
	}
}

const mapShopResource = (resource, platName) => ({
	name: platName || '哈哈',
	active: false,
	child: resource.map(item => ({
		...item,
		name: item.caption,
		active: false,
		value: item.id
	}))
});
const cardGroupsResource = resource => ({
	name: '集团卡',
	value: 'jtk',
	active: false,
	child: resource.map(item => ({
		...item,
		name: item.caption,
		active: false,
		value: item.id
	}))
});
