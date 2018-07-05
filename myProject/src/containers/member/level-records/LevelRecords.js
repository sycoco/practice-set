/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */
import MainCtrl from '../controller';
import { Inject } from 'angular-es-utils';
import DataManage from '../../../common/DataManage';

@Inject('PublicService', '$scope', '$ccGrid', '$ccModal', 'TipsService', '$timeout', '$filter')
export default class LevelRecordsCtrl extends MainCtrl {

	constructor() {
		super({ label: '等级变更记录', name: 'level_records', showExportBtn: 'MG0331', exportType: 'GRADE_RECORD_EXPORT' });
		this.init();
		this.page = 'level-records';
	}
	init() {
		this.isLoadComplete = false;
		this.queryFilters = DataManage.allConfig.getQueryFilters('gradeRecordCondition');
		this.resourcePool = {
			searchResource: 'MemberGradesRecords'
		};
		this.memberListGridOption = {
			queryParams: { pageNum: 1, pageSize: 20 },
			columnsDef: [
				{
					field: 'cardNumber',
					displayName: '会员卡号',
					align: 'left',
					cellTemplate: '<span class="ellipsis" title="{{entity.cardNumber}}">{{entity.cardNumber}}</span>',
					width: '16%'
				},
				{
					field: 'recordSourceCaption',
					displayName: '等级来源',
					align: 'center',
					cellTemplate: '<a cc-tooltip="entity.recordDetail || entity.recordSourceKeys" tooltip-append-to-body="true" tooltip-placement="right" >{{entity.recordSourceCaption}}</a>'
				},
				{
					field: 'sourceGradeConfigCaption',
					displayName: '变更前等级',
					align: 'center'
				},
				{
					displayName: '变更后等级',
					align: 'center',
					field: 'currentGradeConfigCaption'
				},
				{
					displayName: '变更类型',
					align: 'center',
					field: 'changeTypeCaption'
				},
				{
					displayName: '等级有效期',
					align: 'center',
					field: 'gradeOverdueDate',
					cellTemplate: '<span title="{{entity.currentOverdueDate}}">{{entity.currentOverdueDate || "永久有效"}}</span>'
				},
				{
					displayName: '记录关键信息',
					align: 'center',
					field: 'recordSourceKeys'
				},
				{
					displayName: '接口调用来源',
					align: 'center',
					field: 'interfaceSourceCaption'
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
					displayName: '额外描述',
					align: 'center',
					field: 'desc'
				},
				{
					displayName: '变更时间',
					align: 'center',
					field: 'recordDate',
					cellTemplate: '<span class="ellipsis" title="{{entity.recordDate}}">{{entity.recordDate}}</span>',
					width: '16%'
				}
			],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">未查询到符合条件的数据</div>'
		};
		this.memberListGridOption.columnsDef = DataManage.allConfig.getColumnsDef('gradeRecordDetail', this.memberListGridOption.columnsDef);
		this.fillOpts();
	}

}
