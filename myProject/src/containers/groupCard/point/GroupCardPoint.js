/**
 * Created by liwenjie on 2016/12/15.
 */

import Resources from '../../../common/Resources';
import DataManage from '../../../common/DataManage';
import MainCtrl from '../../../containers/member/controller';
import {Inject} from 'angular-es-utils';

@Inject('PublicService', '$scope', '$ccGrid', '$ccModal', 'TipsService', '$timeout', 'GroupCardService', '$ccMenus')
export default class PointesRecordsCtrl extends MainCtrl {

	constructor() {
		super({label: '积分查询', name: 'points_records', showExportBtn: 'MG0210'});
		this._PublicService.onShopChange(this.init.bind(this), this);
		this.init();

		this.isLoadComplete = false;

		this.queryFilters = [
			{
				displayName: DataManage.allConfig.unitViewCaption || '店铺',
				keys: ['shop'],
				values: [undefined],
				viewType: 'SELECT',
				options: [{title: '不限', value: undefined}]
			},
			{
				displayName: '会员昵称',
				keys: ['memberName'],
				values: [''],
				viewType: 'INPUT_STR'
			},
			{
				displayName: '积分来源',
				keys: ['recordSourceName'],
				values: [undefined],
				viewType: 'SELECT',
				options: [{title: '不限', value: undefined}]
			},
			{
				displayName: '变更时间',
				keys: ['createDateStart', 'createDateEnd'],
				values: ['', ''],
				viewType: 'DATE_UNI_YMD',
				logic: 'BETWEEN'
			}
		];

		this.resourcePool = {
			searchResource: 'CardMemberPointsRecords'
		};

		this.memberListGridOption = {
			queryParams: {pageNum: 1, pageSize: 20},
			columnsDef: [
				{
					displayName: DataManage.allConfig.unitViewCaption || '店铺',
					align: 'left',
					cellTemplate: '<span class="iconfont icon-taobao-fill" style="color: #FF4401; margin-left: 11px; margin-right: 7px">'
				},
				{
					field: 'memberName',
					displayName: '会员昵称',
					align: 'left'
				},
				{
					field: 'recordSourceCaption',
					displayName: '积分来源',
					align: 'left'
				},
				{
					field: 'point | number : 0 || 0',
					displayName: '积分',
					align: 'left'
				},
				{
					displayName: '积分有效期',
					align: 'left',
					cellTemplate: '<span title="{{entity.overdueDate}}">{{entity.overdueDate || "永久有效"}}</span>'
				},
				{
					displayName: '变更时间',
					align: 'left',
					field: 'createDate'
				}
			],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">未查询到符合条件的数据</div>'
		};

		Resources.MetaResource.query({metaClass: 'MemberPointRecordSource'}).$promise.then(data => {
			this.queryFilters[2].options = [{title: '不限', value: undefined}].concat(data.map(item => {
				return {title: item.caption, value: item.id};
			}));
		}, error => {
			this._TipsService.showError(error.data.message);
		});
		DataManage.setDataInfo(this, 'currentCtrl');
	}

	configShopSelect() {
		return this._$ccMenus.getCurrentPlatShop().then(data => { // 获取卡计划ID 和卡计划名称
			this.currentPlatShop = data;
			return data.shop.id;
		}).then(id => {
			this._GroupCardService.getAllShopByCardId(id).then(data => {
				this.queryFilters[0].options = [{title: '不限', value: undefined}].concat(data.map(item => {
					return	{title: '【' + (item.platCaption || '淘宝') + '】' + item.caption, value: item.id};
				}));
			});
		});

	}

	init() {
		this.showContent = false;
		this.configShopSelect().then(() => {
			this.showContent = true;
			this.fillOpts();
		});
	}

}

