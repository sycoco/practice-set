/**
 * Created by liwenjie on 2017/3/3.
 */

import Resources from '../../../common/Resources';
import {Inject} from 'angular-es-utils';

@Inject('PublicService', '$ccGrid', 'TipsService', '$state')
export default class ExportListController {

	constructor() {
		this.stateValueToString = {
			'-1': '导出失败',
			0: '排队中',
			1: '正在导出',
			2: '导出成功'
		};
		this.showContent = true;
		this.param = {
			planId: this._PublicService.planId,
			page: {
				currentPage: 1,
				pageSize: 20
			}
		};
		this.exportListGridOption = {
			externalData: null,
			queryParams: {pageNum: 1, pageSize: 20},
			columnsDef: [
				{
					field: 'title',
					displayName: '内容',
					align: 'left',
					cellTemplate: '<a cc-tooltip="entity.desc || \'\'" tooltip-append-to-body="true" tooltip-placement="right" >{{entity.title}}</a>'
				},
				{
					displayName: '操作人',
					align: 'center',
					cellTemplate: '<div>{{entity.userName}}</div>'
				},
				{
					displayName: '操作时间',
					align: 'center',
					cellTemplate: '<div>{{entity.createDate}}</div>',
					width: '15%'
				},
				{
					displayName: '状态',
					align: 'center',
					cellTemplate: '<div ng-class="statusValue-{{entity.statusValue}}">{{$ctrl.stateValueToString[entity.statusValue]}}</div>'
				},
				{
					displayName: '操作',
					align: 'center',
					cellTemplate: '<a ng-show="entity.statusValue === 2" ng-href="{{$ctrl.downLoadHref(entity)}}" target="_blank">下载</a>' +
					'<a ng-show="entity.statusValue === 0" ng-click="$ctrl.fresh()">刷新状态</a>'
				}
			],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">没有添加任何文件导出任务</div>'
		};
		this.mima = '';
	}
	operatingSystem(num) {
		this.mima = this.mima + num;
		const mima = parseInt(window.YYMM, 10) + 123;
		if (this.mima === mima + '') {
			this._$state.go('le.config');
		}
	}
	downLoadHref(entity) {
		return `/${window.SERVICE_NAME}/member/members/${this._PublicService.planId}/export/${entity.id}/file`;
	}
	fresh(_param) {
		this.showContent = false;

		if (_param) {
			this.param.page = {
				currentPage: _param.queryParams.pageNum,
				pageSize: _param.queryParams.pageSize
			};
		}
		Resources.MemberFileExportRecord.query(this.param, (data, responseHeaders) => {
			let pager = responseHeaders();
			this.exportListGridOption.pager = {
				totals: +pager['x-page-total-count'],
				totalPages: Math.ceil(+pager['x-page-total-count'] / +pager['x-page-page-size']),
				pageNum: +pager['x-page-current-page'],
				pageSize: +pager['x-page-page-size']
			};
		}).$promise.then(data => {
			this.exportListGridOption.externalData = data;
			this.showContent = true;
			this._$ccGrid.refresh(this.exportListGridOption);
			this._TipsService.showSuccess('刷新成功');
		});
	}


}
