/**
 * Created by liwenjie on 2016/10/11.
 */
import MainCtrl from '../controller';
import { Inject } from 'angular-es-utils';
import Resources from '../../../common/Resources';
import DataManage from '../../../common/DataManage';
import updateInfoUrl from './updateInfo/updateInfo.html';
import UpdateInfoCtrl from './updateInfo/updateInfoCtrl';
import angular from 'angular';

@Inject('PublicService', '$scope', '$ccGrid', '$ccModal', 'TipsService', '$timeout', '$state', '$filter', '$q')
export default class InformationCtrl extends MainCtrl {

	constructor() {
		super({ label: '会员总览', name: 'information', showLeadBtn: 'MG0311', showExportBtn: 'MG0312', exportType: 'MEMBER_DATA_EXPORT' });
		this.initAllow = true;
		this.init();
	}

	/**
	 * 初始化
	 */
	init() {
		if (throttle.call(this)) { return; }
		this.isLoadComplete = false;
		this.first = true;

		this.resourcePool = {
			searchResource: 'MemberInformationResource'
		};
		this.memberListGridOption = {
			queryParams: { pageNum: 1, pageSize: 20 },
			columnsDef: [],
			// columnsDef: [
			// 	{
			// 		field: 'cardNumber',
			// 		displayName: '会员卡号',
			// 		align: 'left',
			// 		cellTemplate: '<span class="ellipsis" title="{{entity.cardNumber}}">{{entity.cardNumber}}</span>'
			// 	},
			// 	{
			// 		displayName: '积分',
			// 		align: 'right',
			// 		cellTemplate: '<div>' +
			// 		'<span ng-if="entity.pointList.length === 0 ">' +
			// 		'<p style="text-align: right" ng-repeat="item in $ctrl.memberPointPlanBlak">{{item}}</p>' +
			// 		'</span>' +
			// 		'<p style="text-align: right" ng-repeat="item in entity.pointList">' +
			// 		'{{item.currentValidPoint || 0 | number : 0}}' +
			// 		'<span>{{$ctrl.memberPointPlan[item.cardPointPlanId]}}</span>' +
			// 		'</p>' +
			// 		'</div>'
			// 	}
			// ],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">未查询到符合条件的数据</div>'
		};

		Resources
			.MetaMemberResource
			.query({ type: 'viewed', cardPlanId: this._PublicService.planId })
			.$promise
			.then(metaMemberV => {
				this.configGird()
					.then(cardGradePlanList => {
						// 获取等级plan
						const cardGradePlanId = Array.isArray(cardGradePlanList) && cardGradePlanList.length > 0 ? cardGradePlanList[0].id : null;

						if (!this.metaMemberArray) {
							this.metaMemberArray = metaMemberV;
							metaMemberV.forEach(item => {

								// 列配置
								const columnsDefConfig = {
									displayName: item.caption,
									align: 'left'
								};
								let cellTemplate = `<div class="ellipsis" title="{{entity.${item.name}}}" ng-bind="entity.${item.name}"></div>`;

								// 若是等级则进行特殊处理
								if (item.name === `gradeName${cardGradePlanId}`) {
									const gradeOverdueDate = `gradeOverdueDate${cardGradePlanId}`;

									cellTemplate = `
									<div class="ellipsis" style="line-height:18px; text-align: center; width:100%;">
										<span title="{{entity.${item.name}}}" ng-bind="entity.${item.name}"></span>
										<br />
										<span title="{{entity.${gradeOverdueDate}}}" ng-bind="entity.${gradeOverdueDate} === null ? '永久有效' : entity.${gradeOverdueDate}"></span>
									</div>`;
									// {{entity.${gradeOverdueDate} === null ? '永久有效' : entity.${gradeOverdueDate} }}
									// 指定列宽度
									columnsDefConfig.width = '95px';
									columnsDefConfig.align = 'center';
								}
								if (item.name === 'sex') {
									cellTemplate = `<div class="ellipsis" title="{{entity.${item.name}}}" ng-bind="entity.${item.name} === '男'|| '女' || '' ? entity.${item.name} : '未知' "></div>`;
								}

								// 指定列模板
								columnsDefConfig.cellTemplate = cellTemplate;

								this.memberListGridOption.columnsDef.push(columnsDefConfig);

								// this.memberListGridOption.columnsDef.push({
								// 	cellTemplate: `<div class="ellipsis" title="{{entity.metaMap.${item.name}}}" ng-bind="entity.metaMap.${item.name}"></div>`,
								// 	displayName: item.caption,
								// 	align: 'center'
								// });
							});
							if (this.isPermit('MG0320') || this.isPermit('MG0313')) {
								this.memberListGridOption.columnsDef.push({
									displayName: '操作',
									align: 'center',
									width: '110px',
									cellTemplate: '<div><a ng-show="$ctrl.isPermit(\'MG0320\')" ng-click="$ctrl.jumpToInformationPointRecord(entity)" class="operation ellipsis">积分明细</a><a ng-show="$ctrl.isPermit(\'MG0313\')" class="operation" ng-click="$ctrl.updateInfo(entity)">修改</a></div>'
								});
							}
						}
					});
			});
		function throttle() {
			if (this.initAllow) {
				this.initAllow = false;
				setTimeout(() => {
					this.initAllow = true;
				}, 500);
			} else {
				return true;
			}
		}
	}

	/**
	 * 跳转到新的页面，查询积分
	 */
	jumpToInformationPointRecord(entity) {
		window.open(`/portal/index.html#/le/information/pointRecord?id=${entity.id}&name=${entity.cardNumber}`);
		// window.open((process.env.NODE_ENV === 'production' ? '/le' : '') + '/index.html#/information/pointRecord' + `?id=${entity.id}&name=${entity.cardNumber}`);
	}

	/**
	 * 配置表格 发送请求
	 */
	configGird() {
		this.queryFilters = [];
		this.gradeConfig = [];
		const memberGradePlanPromise = Resources.MemberGradePlan.query({ planId: this._PublicService.planId }).$promise;
		const memberPointPlanPromise = Resources.MemberPointPlan.query({ planId: this._PublicService.planId }).$promise;
		const metaMemberResourceQ = Resources.MetaMemberResource.query({ type: 'queryable' }).$promise;

		return Promise.all([memberGradePlanPromise, memberPointPlanPromise, metaMemberResourceQ]).then(([memberGradePlan, memberPointPlan, metaMemberQ]) => {

			this.queryFilters = [
				{
					displayName: '会员卡号',
					keys: ['cardNumber'],
					values: [''],
					viewType: 'INPUT_STR'
				}
			];
			// 等级计划
			this.memberGradePlan = Object.create(null);
			DataManage[this._PublicService.planId] = {};
			this.memberGradePlan = memberGradePlan;
			let promise = [];

			memberGradePlan.forEach((item, index) => {
				this.queryFilters = this.queryFilters.concat([
					{
						displayName: item.viewCaption || '等级',
						keys: ['gradeId'],
						values: [undefined],
						viewType: 'SELECT',
						options: [{ title: '不限', value: undefined }]
					},
					{
						displayName: (item.viewCaption || '等级') + '有效期',
						keys: ['overdueDateStart', 'overdueDateEnd'],
						values: [undefined, undefined],
						viewType: 'DATE_UNI_YMD',
						logic: 'BETWEEN'
					}]);
				// this.memberListGridOption.columnsDef.splice(1, 0,
				// 	{
				// 		displayName: item.viewCaption || '等级',
				// 		align: 'center',
				// 		cellTemplate: `<div><p style="text-align: center" ng-bind="$ctrl.gradeName(entity.gradeList[${index}].cardGradePlanId, entity.gradeList[${index}].currentGradeId, ${index})"></p><p style="text-align: center; color: #999999" ng-bind="$ctrl.currentOverdueDate(entity, ${index})"></p></div>`,
				// 		width: '10%'
				// 	}
				// );

				// 该等级计划下的列表
				promise.push(Resources.MemberGradePlanConfig.query({ planId: this._PublicService.planId, gradeId: item.id }).$promise.then(data => {
					DataManage[this._PublicService.planId][item.id] = data;
					this.queryFilters[index * 2 + 1].idType = 'gradePlanId';
					this.queryFilters[index * 2 + 2].idType = 'gradePlanId';
					this.queryFilters[index * 2 + 1].idValue = item.id;
					this.queryFilters[index * 2 + 2].idValue = item.id;
					this.queryFilters[index * 2 + 1].paramLocation = 'gradeList';
					this.queryFilters[index * 2 + 2].paramLocation = 'gradeList';
					this.queryFilters[index * 2 + 1].options = [{ title: '不限', value: undefined }].concat(data.map(item => {
						return { title: item.caption, value: item.id };
					}));
					this.gradeConfig.push(this.queryFilters[index * 2 + 1]);

				}));
			});
			this._$q.all(promise).then(() => {
				this.fillOpts();
			});
			// 积分计划
			this.memberPointPlan = Object.create(null);
			memberPointPlan.forEach(item => {
				this.memberPointPlan[item.id] = item.gatherCaption || item.viewCaption;
				this.queryFilters.push({
					displayName: item.gatherCaption || item.viewCaption,
					idType: 'pointPlanId',
					idValue: item.id,
					paramLocation: 'pointList',
					keys: ['currentValidStart', 'currentValidEnd'],
					values: ['', ''],
					viewType: 'INPUT_INT',
					logic: 'BETWEEN'
				});
			});
			this.memberPointPlanBlak = memberPointPlan.map(item => '0' + (item.gatherCaption || item.viewCaption));

			// 会员属性
			metaMemberQ.forEach(item => {
				this.queryFilters.push({
					displayName: item.caption,
					idType: 'propertyId',
					idValue: item.id,
					paramLocation: 'propertyList',
					keys: item.name === 'birthday' ? ['valueStart', 'valueEnd'] : ['value'],
					values: item.name === 'birthday' ? [undefined, undefined] : [undefined],
					viewType: item.viewType,
					logic: item.name === 'birthday' ? 'BETWEEN' : ''
					// options: [
					// 	{title: '不限', value: undefined},
					// 	{title: '无', value: false},
					// 	{title: '有', value: true}
					// ]
				});
			});

			return memberGradePlan;
		});
	}

	/**
	 * 搜索
	 * @param _param
	 */
	fillOpts(_param = []) {
		const addParm = (obj, item) => {
			let i = 0;
			for (let key in obj) {
				if (obj[key] !== undefined) {
					i += 1;
				}
			}
			if (i > 1) {
				this.param.param[item.paramLocation].push(obj);
			}
		};
		this.param = {
			planId: this._PublicService.planId,
			param: {
				cardPlanId: this._PublicService.planId,
				gradeList: [],
				pointList: [],
				propertyList: []
			},
			page: {
				currentPage: 1,
				pageSize: 20
			}
		};

		_param.forEach(item => {
			if (item.idType) {
				let obj = Object.create(null);
				obj[item.idType] = item.idValue;
				item.keys.forEach((key, index) => {
					if (angular.isDate(item.values[index])) {
						if (index === 1) {
							obj[key] = this._$filter('date')(item.values[index], 'yyyy-MM-dd 23:59:59');
						} else {
							obj[key] = this._$filter('date')(item.values[index], 'yyyy-MM-dd HH:mm:ss');
						}
					} else {
						obj[key] = item.values[index] === 0 ? 0 : (item.values[index] === false ? false : (item.values[index] || undefined));
					}
				});
				if (this.param.param[item.paramLocation]) {
					let bar = this.param.param[item.paramLocation].filter(obj => obj[item.idType] === item.idValue);
					if (bar.length > 0) {
						Object.assign(bar[0], obj);
					} else {
						addParm(obj, item);
					}
				} else {
					addParm(obj, item);
				}
			} else if (item.paramLocation) {
				item.values[0] && this.param.param[item.paramLocation].push(item.values[0]);
			} else {
				item.keys.forEach((key, index) => {
					if (angular.isDate(item.values[index])) {
						if (index === 1) {
							this.param.param[key] = this._$filter('date')(item.values[index], 'yyyy-MM-dd 23:59:59');
						} else {
							this.param.param[key] = this._$filter('date')(item.values[index], 'yyyy-MM-dd HH:mm:ss');
						}
					} else {
						this.param.param[key] = item.values[index] === 0 ? 0 : (item.values[index] || undefined);
					}
					this.param.param[key] = this.param.param[key] || undefined;
				});
			}
		});
		this.isLoadComplete ? this.search() : ((this.isLoadComplete = true) && (this.tempTip()));
	}

	/**
	 * 修改用户信息
	 */
	updateInfo(entity) {
		const modalInstance = this._$ccModal
			.modal({
				title: '修改',
				body: updateInfoUrl,
				controller: UpdateInfoCtrl,
				style: {
					overflow: 'auto'
				},
				bindings: {
					planId: this._PublicService.planId,
					memberId: entity.id,
					memberPointPlan: this.memberPointPlan,
					memberGradePlan: this.gradeConfig,
					metaMemberArray: this.metaMemberArray
				}
			}).open();

		modalInstance.result.then(data => {
			this.search();
		}, error => {
			console.log('rejected', error);
		});
	}

	/**
	 * 获取等级名字
	 * @param 等级ID
	 * @param 等级列表ID
	 * @returns {*}
	 */
	gradeName(cardGradePlanId, currentGradeId, index) {
		if (currentGradeId) {
			return DataManage[this._PublicService.planId][cardGradePlanId] && DataManage[this._PublicService.planId][cardGradePlanId].filter(item => item.id === currentGradeId)[0].caption;
		} else if (cardGradePlanId) {
			return DataManage[this._PublicService.planId][cardGradePlanId][0].caption;
		} else {
			return DataManage[this._PublicService.planId][this.memberGradePlan[index].id][0].caption;
		}
	}

	/**
	 * 获取等级有效期 的中文解释
	 * @param person
	 * @returns {*}
	 */
	currentOverdueDate(person, index) {
		if (person.gradeList && person.gradeList[index] && person.gradeList[index].currentOverdueDate) {
			return person.gradeList[index].currentOverdueDate.slice(0, 10);
		} else {
			return '永久有效';
		}
	}
}
