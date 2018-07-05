/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */
import Resources from '../../../common/Resources';
import {Inject} from 'angular-es-utils';

@Inject('PublicService', '$scope', '$ccGrid', '$ccModal', '$state', '$timeout', 'TipsService')
export default class BatchImportCtrl {

	constructor() {
		this.showGrid = false;
		this.memberListGridOption = {
			queryParams: {pageNum: 1, pageSize: 10},
			columnsDef: [
				{
					field: 'fileName',
					displayName: '文件名称',
					align: 'left'
				},
				{
					field: 'recordNum | number : 0 || 0',
					displayName: '总记录数',
					align: 'left'
				},
				{
					field: 'successNum | number : 0 || 0',
					displayName: '成功导入数',
					align: 'left'
				},
				{
					displayName: '失败数',
					align: 'left',
					field: 'failNum | number : 0 || 0'
				},
				{
					displayName: '导入时间',
					align: 'center',
					field: 'time'
				},
				{
					displayName: '导入状态',
					align: 'left',
					field: 'status'
				},
				{
					displayName: '操作',
					align: 'center',
					cellTemplate: '<a class="operation" ng-show="entity.failNum > 0" ng-href="{{$ctrl.failUploadDownload(entity)}}">下载失败列表</a>'
				}
			],
			emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">未查询到符合条件的数据</div>'
		};
		let formElement = document.getElementById('xFile');
		let changeListener = () => this.fileUpload();
		formElement.addEventListener('change', changeListener);
	}

	search(_param) {
		this.param = {
			planId: this._PublicService.planId,
			page: {
				currentPage: _param.queryParams.pageNum,
				pageSize: _param.queryParams.pageSize
			}
		};
		Resources.MemberUploadRecord.query(this.param, (data, responseHeaders) => {
			let pager = responseHeaders();
			this.memberListGridOption.pager = {
				totals: +pager['x-page-total-count'],
				totalPages: Math.ceil(+pager['x-page-total-count'] / +pager['x-page-page-size']),
				pageNum: +pager['x-page-current-page'],
				pageSize: +pager['x-page-page-size']
			};
			this.memberListGridOption.externalData = data;
			this._$ccGrid.refresh(this.memberListGridOption);
			this.showGrid = true;
		}, () => {
			this._TipsService.showError('加载出错');
			this.showGrid = true;
		});
	}

	fileUpload(state) {
		this.showLoading = true;
		let file = new FormData(document.forms.uploadForm);
		let xFile = document.forms.uploadForm['xFile'].files[0];
		file.append('file', xFile);
		file.append('platCode', 'taobao'); // 此处理应给个下拉选择框 ,国俊说就这样吧
		console.log(xFile);
		if (!(/(txt|csv)$/.test(xFile.name))) {
			this._TipsService.showError('文件必须是txt或者csv格式');
			this.showLoading = false;
			return;
		}
		xFile && Resources.MemberInfoUpload.upload({planId: this._PublicService.planId}, file).$promise
		.then(data => {
			this.showLoading = false;
			this._$state.go('le.member.fileUpload', {importId: data.id});
		}, error => {
			this.showLoading = false;
			this._TipsService.showError('上传失败', error);
			console.log(error);
		});
	}

	/**
	 * 下载失败列表文件
	 */
	failUploadDownload(entity) {
		return `/${window.SERVICE_NAME}/member/members/${this._PublicService.planId}/import/${entity.id}/fail`;
	}
}

