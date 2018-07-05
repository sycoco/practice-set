/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */
import MainCtrl from '../controller';
import { Inject } from 'angular-es-utils';
import DataManage from '../../../common/DataManage';

@Inject('PublicService', '$scope', '$ccGrid', '$ccModal', 'TipsService', '$timeout', '$filter')
export default class InformationRecordsCtrl extends MainCtrl {

	constructor() {
		super({ label: '信息变更记录', name: 'information_records', showExportBtn: 'MG0341', exportType: 'MEMBER_RECORD_EXPORT' });
		this.init();
		this.page = 'infomation-records';
	}

	init() {
		this.resourcePool = {
			searchResource: 'MemberMetasRecords'
		};

		this.isLoadComplete = false;
		this.queryFilters = DataManage.allConfig.getQueryFilters('infoRecordCondition');
		this.memberListGridOption = {
			queryParams: { pageNum: 1, pageSize: 20 },
			columnsDef: [
				{
					key: 'name',
					field: 'cardNumber',
					displayName: '会员卡号',
					align: 'left'
				},
				{
					key: 'recordSource',
					field: 'recordSourceCaption',
					displayName: '信息来源',
					align: 'left',
					cellTemplate: '<a cc-tooltip="entity.recordDetail || entity.recordSourceKeys" tooltip-append-to-body="true" tooltip-placement="right" >{{entity.recordSourceCaption}}</a>'
				},
				{
					field: 'propertyCaption',
					displayName: '信息字段',
					align: 'left'
				},
				{
					displayName: '变更前信息',
					align: 'left',
					field: 'oldValue',
					cellTemplate: '<span>{{entity.oldValue !== \'null\' && entity.oldValue || \'无\'}}</span>'
				},
				{
					displayName: '变更后信息',
					align: 'left',
					field: 'newValue',
					cellTemplate: '<span>{{entity.newValue}}</span>'
				},
				{
					displayName: '记录关键信息',
					align: 'center',
					field: 'recordSourceKeys'
				},
				{
					displayName: '记录来源关键信息',
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
					align: 'left',
					field: 'createDate'
				}
			],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">未查询到符合条件的数据</div>'
		};
		this.memberListGridOption.columnsDef = DataManage.allConfig.getColumnsDef('infoRecordDetail', this.memberListGridOption.columnsDef);

		this.fillOpts();
	}
}

