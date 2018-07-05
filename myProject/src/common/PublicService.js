/**
 * Created by liwenjie on 2017/1/11.
 */

import { Inject } from 'angular-es-utils';
import Resources from './Resources';
import DataManage from './DataManage';

@Inject('$ccMenus', 'TipsService', '$q')
export default class PublicService {
	static jurisdiction = {};
	static allConfig = DataManage.allConfig;

	constructor() {
		this.onShopChange = this.onShopChange.bind(this);
		this.callBackPool = [];
	}

	/**
	 * 注册每个页面切换店铺后 请求planId，然后回调
	 * @param fn 需要回调的方法
	 * @param ctrl 需要注册晓辉的控制器
	 */
	onShopChange(fn, ctrl) {
		this.callBackPool.push(fn);
		ctrl._$scope.$on('$destroy', () => {
			let index = this.callBackPool.find(item => {
				return item === fn;
			});
			this.callBackPool.splice(index, 1);
		});
	}

	getAllConfig() {
		return Resources.allConfigResource
			.get()
			.$promise
			.then(allConfig => {
				allConfig.dataCountDateStart = allConfig.dataCountDateStart && allConfig.dataCountDateStart.replace(/-/g, '/') || '2015-01-01';
				allConfig.ruleExecuteDate = allConfig.ruleExecuteDate || '03:00';
				this.saveConfig(allConfig);
				return DataManage.allConfig.showPermissionList;
			});
	}

	saveConfig(allConfig) {
		const needTransConfigKey = ['gradeRecordCondition', 'gradeRecordDetail', 'infoRecordCondition', 'infoRecordDetail', 'pointRecordCondition', 'pointRecordDetail'];
		needTransConfigKey.forEach(key => {
			if (allConfig[key]) {
				let data = allConfig[key].split(',');
				CONFIG[key].forEach(item => {
					item.show = data.indexOf(item.key) >= 0;
				});
			}
		});
		DataManage.allConfig = Object.assign(allConfig, CONFIG);
	}

	jurisdictionResource(showPermissionList) {
		if (!showPermissionList) {
			return new Promise(resolve => {
				DataManage.jurisdiction = conversion(PermissionKeyData);
				resolve(DataManage.jurisdiction);
			});
		}
		return Resources.JurisdictionResource.query().$promise.then(data => {
			DataManage.jurisdiction = conversion(data);
			return DataManage.jurisdiction;
		}, () => {
			if (['zcd.fenxibao.com', 'le.fenxibao.com', 'le2.fenxibao.com'].some(item => item === location.hostname)) {
				return new Promise(resolve => {
					DataManage.jurisdiction = conversion(PermissionKeyData);
					resolve(DataManage.jurisdiction);
				});
			} else {
				this._TipsService.showError('获取权限列表失败，请联系数云售后服务');
				return false;
			}
		});
		function conversion(data) {
			let temp = {};
			data.forEach(item => {
				temp[item.permissionKey] = item.name;
			});
			return temp;
		}
	}

	isPermit(key) {
		if (!key) return false;
		return !!DataManage.jurisdiction[key];
	}
}
const CONFIG = {
	getMetaextPromise(metaClass) {
		return Resources.MetaResource.query({ metaClass: metaClass }).$promise.then(data => {
			return [{ title: '不限', value: undefined }].concat(data.map(item => {
				return { title: item.caption, value: item.name };
			}));
		});
	},
	getQueryFilters(key) {
		this.freshOptionData(key);
		return this[key].filter(item => item.show);
	},
	getColumnsDef(key, columnsDef) {
		return columnsDef.filter(colum => {
			return this[key].some(item => {
				return (item.key === colum.field || item.field === colum.field || item.key + 'Caption' === colum.field || (item.keys && item.keys[0]) === colum.field) && item.show;
			});
		});
	},
	freshOptionData(key) {
		this[key] && this[key].forEach(item => {
			item.show && item.optionFresh && item.optionFresh.call(this, item);
		});
	},
	// 等级规则 搜索条件
	gradeRecordCondition: [
		{
			displayName: '会员卡号',
			key: 'cardNumber',
			keys: ['cardNumber'],
			viewType: 'INPUT_STR',
			values: ['']
		},
		{
			key: 'gradeType',
			displayName: '等级类型',
			keys: ['cardGradePlanId'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{ title: '不限', value: undefined }],
			optionFresh(item) {
				Resources.MemberGradePlan.query({ planId: DataManage.planId }).$promise.then(data => {
					if (data.length < 2) {
						item.displayName = '';
					} else {
						item.displayName = '等级类型';
						item.options = [{ title: '不限', value: undefined }].concat(data.map(item => {
							return {
								title: item.caption + `[${item.viewCaption}]`,
								value: item.id
							};
						}));
					}

				});
			}
		},
		{
			displayName: '等级来源',
			key: 'recordSourceName',
			keys: ['recordSourceName'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{
				title: '不限',
				value: undefined
			}],
			optionFresh(item) {
				this.getMetaextPromise('MemberGradeRecordSource').then(data => {
					item.options = data;
				});
			}
		},
		{
			displayName: '变更类型',
			key: 'recordType',
			keys: ['recordType'],
			viewType: 'SELECT',
			values: [undefined],
			options: [
				{ title: '不限', value: undefined },
				{ title: '升级', value: 'UPGRADE' },
				{ title: '保级', value: 'KEEPING' },
				{ title: '降级', value: 'DEGRADE' }
			]
		},
		{
			displayName: '接口调用来源',
			key: 'interfaceSourceName',
			keys: ['interfaceSourceName'],
			viewType: 'SELECT',
			values: [undefined],
			options: [{ title: '不限', value: undefined }],
			optionFresh(item) {
				this.getMetaextPromise('InterfaceSource').then(data => {
					item.options = data;
				});
			}
		},
		{
			displayName: '接口调用流水号',
			key: 'interfaceSequence',
			keys: ['interfaceSequence'],
			viewType: 'INPUT_STR',
			values: ['']
		},
		{
			displayName: '接口调用关键信息',
			key: 'recordSourceKeys',
			keys: ['recordSourceKeys'],
			viewType: 'INPUT_STR',
			values: ['']
		},
		{
			displayName: '变更时间',
			key: 'recordDate',
			keys: ['recordDateStart', 'recordDateEnd'],
			viewType: 'DATE_UNI_YMD',
			values: ['', ''],
			logic: 'BETWEEN'
		}],
	// 等级规则 表格列
	gradeRecordDetail: [
		{ displayName: '会员卡号', key: 'cardNumber', field: 'cardNumber' },
		{ displayName: '等级来源', key: 'recordSourceName', field: 'recordSourceCaption' },
		{ displayName: '变更前等级', key: 'sourceGradeId', field: 'sourceGradeConfigCaption' },
		{ displayName: '变更后等级', key: 'currentGradeId', field: 'currentGradeConfigCaption' },
		{ displayName: '变更类型', key: 'recordType', field: 'changeTypeCaption' },
		{ displayName: '等级有效期', key: 'currentOverdueDate', field: 'gradeOverdueDate' },
		{ displayName: '变更时间', key: 'recordDate', field: 'currentOverdueDate' },
		{ displayName: '记录关键信息', key: 'recordSourceKeys' },
		{ displayName: '接口调用来源', key: 'interfaceSourceName', field: 'interfaceSourceCaption' },
		{ displayName: '接口调用序列号', key: 'interfaceSequence' },
		{ displayName: '记录详细描述', key: 'recordDetail' },
		{ displayName: '额外描述', key: 'desc' }],
	// 信息变更记录 搜索条件
	infoRecordCondition: [
		{
			displayName: '会员卡号',
			key: 'cardNumber',
			keys: ['cardNumber'],
			values: [''],
			viewType: 'INPUT_STR',
			isScreening: 0
		},
		{
			displayName: '信息来源',
			key: 'recordSourceName',
			keys: ['recordSourceName'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{ title: '不限', value: undefined }],
			optionFresh(item) {
				this.getMetaextPromise('MemberMetaRecordSource').then(data => {
					item.options = data;
				});
			}
		},
		{
			displayName: '接口调用来源',
			key: 'interfaceSourceName',
			keys: ['interfaceSourceName'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{ title: '不限', value: undefined }],
			optionFresh(item) {
				this.getMetaextPromise('InterfaceSource').then(data => {
					item.options = data;
				});
			}
		},
		{
			displayName: '接口调用序列号',
			key: 'interfaceSequence',
			keys: ['interfaceSequence'],
			values: [''],
			viewType: 'INPUT_STR'
		},
		{
			displayName: '关键信息',
			key: 'recordSourceKeys',
			keys: ['recordSourceKeys'],
			values: [''],
			viewType: 'INPUT_STR'
		},
		{
			key: 'createDate',
			displayName: '变更时间',
			keys: ['createDateStart', 'createDateEnd'],
			values: ['', ''],
			viewType: 'DATE_UNI_YMD',
			logic: 'BETWEEN'
		}],
	infoRecordDetail: [
		{ displayName: '会员卡号', key: 'cardNumber', field: 'cardNumber' },
		{ displayName: '信息来源', key: 'recordSourceName' },
		{ displayName: '信息字段', key: 'propertyId', field: 'propertyCaption' },
		{ displayName: '变更前信息', key: 'oldValue' },
		{ displayName: '变更后信息', key: 'newValue' },
		{ displayName: '变更时间', key: 'createDate' },
		{ displayName: '记录关键信息', key: 'recordSourceKeys' },
		{ displayName: '接口调用来源', key: 'interfaceSourceName', field: 'interfaceSourceCaption' },
		{ displayName: '接口调用序列号', key: 'interfaceSequence' },
		{ displayName: '记录详细描述', key: 'recordDetail' },
		{ displayName: '额外描述', key: 'desc' }],
	// 积分变更记录 搜索条件
	pointRecordCondition: [
		{
			key: 'cardNumber',
			displayName: '会员卡号',
			keys: ['cardNumber'],
			values: [''],
			viewType: 'INPUT_STR'
		},
		{
			key: 'pointType',
			displayName: '积分类型',
			keys: ['cardPointPlanId'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{ title: '不限', value: undefined }],
			optionFresh(item) {
				Resources.MemberPointPlan.query({ planId: DataManage.planId }).$promise.then(data => {
					if (data.length < 2) {
						item.displayName = '';
					} else {
						item.displayName = '积分类型';
						item.options = [{ title: '不限', value: undefined }].concat(data.map(item => {
							return {
								title: item.caption + `[${item.viewCaption}]`,
								value: item.id
							};
						}));
					}
				});
			}
		},
		{
			displayName: '积分',
			key: 'point',
			keys: ['pointStart', 'pointEnd'],
			values: ['', ''],
			viewType: 'INPUT_INT',
			logic: 'BETWEEN'
		},
		{
			key: 'recordSourceKeys',
			displayName: '关键信息',
			keys: ['recordSourceKeys'],
			values: [''],
			viewType: 'INPUT_STR'
		},
		{
			displayName: '记录类型',
			key: 'recordType',
			keys: ['recordType'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{
				title: '不限',
				value: undefined
			}, {
				title: '获取',
				value: 'GAIN'
			}, {
				title: '扣除',
				value: 'DEDUCT'
			}, {
				title: '过期',
				value: 'OVERDUE'
			}, {
				title: '冻结中',
				value: 'FREEZE'
			}, {
				title: '在途',
				value: 'TRANSIT'
			}, {
				title: '锁定',
				value: 'LOCKED'
			}, {
				title: '取消锁定',
				value: 'UNLOCK'
			}, {
				title: '取消订单',
				value: 'CANCEL'
			}]
		},
		{
			displayName: '变更方式',
			key: 'changeType',
			keys: ['changeType'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{
				title: '不限',
				value: undefined
			}, {
				title: '会员主动',
				value: 'POSITIVE'
			}, {
				title: '系统调用',
				value: 'SYSTEM'
			}, {
				title: '客服',
				value: 'CUSTOMER_SERVICE'
			}]
		},
		{
			key: 'recordSourceName',
			displayName: '积分来源',
			keys: ['recordSourceName'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{ title: '不限', value: undefined }],
			optionFresh(item) {
				this.getMetaextPromise('MemberPointRecordSource').then(data => {
					item.options = data;
				});
			}
		},
		{
			key: 'recordSubSourceName',
			displayName: '记录具体来源',
			keys: ['recordSubSourceName'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{ title: '不限', value: undefined }],
			optionFresh(item) {
				this.getMetaextPromise('MemberPointRecordSubSource').then(data => {
					item.options = data;
				});
			}
		},
		{
			key: 'interfaceSourceName',
			displayName: '接口调用来源',
			keys: ['interfaceSourceName'],
			values: [undefined],
			viewType: 'SELECT',
			options: [{ title: '不限', value: undefined }],
			optionFresh(item) {
				this.getMetaextPromise('InterfaceSource').then(data => {
					item.options = data;
				});
			}
		},
		{
			displayName: '接口调用流水号',
			key: 'interfaceSequence',
			keys: ['interfaceSequence'],
			viewType: 'INPUT_STR',
			values: ['']
		},
		{
			key: 'createDate',
			displayName: '变更时间',
			keys: ['createDateStart', 'createDateEnd'],
			values: ['', ''],
			viewType: 'DATE_UNI_YMD',
			logic: 'BETWEEN'
		},
		{
			displayName: '',
			keys: ['memberId'],
			values: [''],
			viewType: 'HIDE'
		}],
	// 积分变更记录 列表
	pointRecordDetail: [
		{ displayName: '会员卡号', key: 'cardNumber', field: 'cardNumber' },
		{ displayName: '记录类型', key: 'recordType', field: 'recordTypeCaption' },
		{ displayName: '变更方式', key: 'changeType', field: 'changeTypeCaption' },
		{ displayName: '冻结时间', key: 'freezeTime' },
		{ displayName: '积分', key: 'point' },
		{ displayName: '记录生效时', key: 'effectiveDate' },
		{ displayName: '过期时间', key: 'overdueDate' },
		{ displayName: '变更时间', key: 'createDate' },
		{ displayName: '记录来源', key: 'recordSourceName', field: 'recordSourceCaption' },
		{ displayName: '记录具体来源', key: 'recordSubSourceName', field: 'recordSubSource' },
		{ displayName: '记录来源关键信息', key: 'recordSourceKeys' },
		{ displayName: '接口调用来源', key: 'interfaceSourceName', field: 'interfaceSource' },
		{ displayName: '接口调用序列号', key: 'interfaceSequence' },
		{ displayName: '记录详细描述', key: 'recordDetail' },
		{ displayName: '额外描述', key: 'desc' }]
};
const PermissionKeyData = [{
	name: '集团卡设置',
	permissionKey: 'MG0100'
}, {
	name: '积分变更记录',
	permissionKey: 'MG0200'
}, {
	name: '集团卡积分变更记录导出',
	permissionKey: 'MG0210'
}, {
	name: '会员信息管理',
	permissionKey: 'MG0300'
}, {
	name: '忠诚度管理',
	permissionKey: 'MG0400'
}, {
	name: '会员总览',
	permissionKey: 'MG0310'
}, {
	name: '积分变更记录',
	permissionKey: 'MG0320'
}, {
	name: '等级变更记录',
	permissionKey: 'MG0330'
}, {
	name: '信息变更记录',
	permissionKey: 'MG0340'
}, {
	name: '会员卡设置',
	permissionKey: 'MG0410'
}, {
	name: '等级规则',
	permissionKey: 'MG0420'
}, {
	name: '积分规则',
	permissionKey: 'MG0430'
}, {
	name: '会员相关数据导入',
	permissionKey: 'MG0311'
}, {
	name: '导出会员信息数据',
	permissionKey: 'MG0312'
}, {
	name: '修改',
	permissionKey: 'MG0313'
}, {
	name: '立即营销',
	permissionKey: 'MG0314-无'
}, {
	name: '导出积分变更记录',
	permissionKey: 'MG0321'
}, {
	name: '导出等级变更记录',
	permissionKey: 'MG0331'
}, {
	name: '导出信息变更记录',
	permissionKey: 'MG0341'
}];
