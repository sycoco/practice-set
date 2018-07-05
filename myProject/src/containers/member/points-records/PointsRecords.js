/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */
import MainCtrl from '../controller';
import { Inject } from 'angular-es-utils';
import DataManage from '../../../common/DataManage';

@Inject('PublicService', '$scope', '$ccGrid', '$ccModal', 'TipsService', '$timeout', '$location', '$filter')
export default class PointesRecordsCtrl extends MainCtrl {

	constructor() {
		super({ label: '积分变更记录', name: 'points_records', showExportBtn: 'MG0341', exportType: 'POINT_RECORD_EXPORT' });
		this.isLoadComplete = false;
		this.page = 'points-records';
		this.init();
	}
	init() {
		this.queryFilters = DataManage.allConfig.getQueryFilters('pointRecordCondition');
		this.queryFilters.forEach(item => {
			if (item.keys[0] === 'cardNumber') {
				item.values = [this._$location.$$search.name || ''];
			} else if (item.keys[0] === 'memberId') {
				item.values = [this._$location.$$search.id || ''];
			}
		});

		this.resourcePool = {
			searchResource: 'MemberPointsRecords'
		};

		this.memberListGridOption = {
			queryParams: { pageNum: 1, pageSize: 20 },
			columnsDef: [
				{
					field: 'cardNumber',
					displayName: '会员卡号',
					align: 'left'
				},
				{
					field: 'recordSourceCaption',
					displayName: '积分来源',
					align: 'center',
					cellTemplate: '<a cc-tooltip="entity.recordDetail || entity.recordSourceKeys" tooltip-append-to-body="true" tooltip-placement="right" >{{entity.recordSourceCaption}}</a>'
				},
				{
					field: 'recordSourceName',
					displayName: '记录具体来源',
					align: 'center',
					cellTemplate: '<span>{{recordSubSourceCaption || "无"}}</span>'

				},
				{
					field: 'recordType',
					displayName: '接口调用来源',
					align: 'center',
					cellTemplate: '<span>{{entity.interfaceSourceCaption}}</span>'
				},
				{
					displayName: '记录类型',
					align: 'center',
					field: 'recordTypeCaption'
				},
				{
					field: 'point',
					displayName: '积分',
					align: 'right',
					cellTemplate: '<span>{{(entity.recordType === "DEDUCT" || entity.recordType === "OVERDUE") ? "-" : ""}}{{entity.point | number}}{{entity.pointPlanCaption || "分"}}</span>'
				},
				{
					field: 'overdueDate',
					displayName: '积分有效期',
					align: 'center',
					cellTemplate: '<div title="{{entity.overdueDate}}">{{entity.overdueDate || (entity.recordType === "GAIN" ? "永久有效" : "")}}</div>'
				},
				{
					displayName: '变更时间',
					align: 'center',
					field: 'createDate'
				},
				{
					displayName: '记录生效时间',
					align: 'center',
					field: 'effectiveDate'
				},
				{
					displayName: '冻结时间',
					align: 'center',
					field: 'freezeTime'
				},
				{
					displayName: '记录来源关键信息',
					align: 'center',
					field: 'recordSourceKeys'
				},
				{
					displayName: '接口调用序列号',
					align: 'center',
					field: 'interfaceSequence'
				},
				{
					displayName: '记录详细描述',
					align: 'center',
					field: 'recordDetail'
				},
				{
					displayName: '变更方式',
					align: 'center',
					field: 'changeTypeCaption'
				},
				{
					displayName: '额外描述',
					align: 'center',
					field: 'desc'
				}
			],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">未查询到符合条件的数据</div>'
		};
		this.memberListGridOption.columnsDef = DataManage.allConfig.getColumnsDef('pointRecordDetail', this.memberListGridOption.columnsDef);


		this.fillOpts(this._$location.$$search.id && this.queryFilters || undefined);
	}

}

