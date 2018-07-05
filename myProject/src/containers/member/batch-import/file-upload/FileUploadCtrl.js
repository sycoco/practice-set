/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-30
 */
import Resources from '../../../../common/Resources';
import { Inject } from 'angular-es-utils';
import { NumberCommon } from '../../../../common/utils';
import angular from 'angular';

@Inject('PublicService', '$scope', '$ccGrid', '$ccModal', '$state', '$stateParams', '$timeout', 'TipsService', '$q')
export default class FileUploadCtrl {

	constructor() {
		this.importId = this._$stateParams.importId || '';
		this.showGrid = false;// 接口数据返回后才显示
		this.valueList = [];// 表格列表配置
		this.firstLine = false;
		this.selectList = [];
		this.initFileInfo();
	}

	initFileInfo() {
		const MemberInfoUploadPlayPromise = Resources.MemberInfoUploadPlay.get({planId: this._PublicService.planId, importId: this.importId}).$promise;
		const MemberInfoConfigPromise = Resources.MemberInfoConfig.query({planId: this._PublicService.planId}).$promise;
		this._$q.all([MemberInfoUploadPlayPromise, MemberInfoConfigPromise])
			.then(([MemberInfoUploadPlayData, MemberInfoConfigData]) => {
				this.file = MemberInfoUploadPlayData;
				this.memberListGridOption = {
					columnsDef: [],
					showPagination: false,
					emptyTipTpl: '<div class="init-msg"><span class="warning"></span><span class="msg">未查询到符合条件的数据</div>'
				};
				this.fileColumn = [];
				for (let i = 0, len = this.file.columnCount; i < len; i++) {
					let numer_ZH = NumberCommon.numberToChinese(i + 1);
					this.memberListGridOption.columnsDef.push({
						displayName: '第' + numer_ZH + '列',
						align: 'left',
						cellTemplate: `<div>
								   						<p>{{entity[${i}]}}</p>
								   				 </div>`
					});
					this.fileColumn.push({title: numer_ZH, value: i});
					this.valueList.push({
						caption: '请选择...',
						name: null,
						type: ''
					});
					// this.valueList.length = this.file.columnCount;
				}
				return MemberInfoConfigData;
			})
			.then(MemberInfoConfigData => {
				this.datalist = MemberInfoConfigData.map(item => {
					item.selected = false;
					return item;
				});
				this.datalist.unshift({
					caption: '请选择...',
					name: null,
					type: ''
				});
				this.selectArray = MemberInfoConfigData;
				for (let i = 0, len = this.file.columnCount; i < len; i++) {
					this.selectList[i] = angular.copy(this.datalist);
				}
				this.memberListGridOption.externalData = this.file.lists;
				this._$ccGrid.refresh(this.memberListGridOption);
				this.showGrid = true;
				this._$timeout(() => {
					document.querySelector('#grid').style.height = `${this.file.lists.length * 42 + 85}px`;
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	fileColumnConfig(name, oldName, column) {
		this.datalist.forEach((item, index) => {
			if (item.name === name && item.name !== null) {
				item.column = column + 1;
				item.selected = true;
				this.valueList[column] = Object.assign({}, item);
				this.memberListGridOption.columnsDef[column].displayName = item.caption;
			}
			if (item.name === oldName) {
				item.selected = false;
			}
			if (item.name === null) {
				this.memberListGridOption.columnsDef[column].displayName = '第' + NumberCommon.numberToChinese(column + 1) + '列';
			}
		});
	}

	/**
	 * 当前配置列打开panel时，去除其他选择过的配置项
	 */
	datalistfilter(column, name) {
		this.selectList[column] = this.datalist.filter(item => item.name === name || !item.selected);
	}

	/**
	 * 校验数据后保存
	 */
	validator() {
		this.pointId = undefined;
		this.valueList1 = this.valueList.filter(item => item.name);
		// 至少需要选择会员昵称 + 任一其他的数据（积分有效期除外）
		if (this.valueList1.length < 1) {
			this._TipsService.showError('至少需要选择会员卡号 + 任一其他的数据（积分有效期除外）');
			return;
		}

		let hasMemberName = this.valueList1.find(item => item.name === 'cardNumber');
		// 若未选择会员卡号
		if (!hasMemberName) {
			this._TipsService.showError('请选择会员卡号的列！');
			return;
		}
		// 若只选择会员昵称
		if (this.valueList1.length === 1 && hasMemberName) {
			this._TipsService.showError('请选择至少两列数据！');
			return;
		}
		// 若选择{积分名称}有效期，但是没选{积分名称}
		const pointSubstring = 'pointOverdueDate';
		this.pointOverdueDateList = this.valueList1.filter(item => item.name.indexOf(pointSubstring) > -1);
		for (let i = 0, len = this.pointOverdueDateList.length; i < len; i++) {
			this.pointId = this.pointOverdueDateList[i].name.substring(pointSubstring.length);
			this.hasPoint = this.valueList1.find(item => item.name.indexOf('point' + this.pointId) > -1);
			if (!this.hasPoint) break;
		}
		// 接口返回的配置项里必须有积分这一项
		let invaildPoint = this.selectArray.find(item => item.name.indexOf('point' + this.pointId) > -1);
		if (!this.hasPoint && invaildPoint) {
			this._TipsService.showError(invaildPoint.caption + '有效期需要配合' + invaildPoint.caption + '使用！');
			return;
		}
		// 若选择等级，但没有选择等级有效期
		const gradeSubstring = 'gradeOverdueDate';
		let gradeOverdueDate = this.selectArray.find(item => item.name.indexOf(gradeSubstring) > -1);
		let hasGradeOverdueDate = this.valueList1.find(item => item.name.indexOf(gradeSubstring) > -1);
		let hasGrade = gradeOverdueDate && this.valueList1.find(item => item.name.indexOf('grade' + gradeOverdueDate.name.substring(gradeSubstring.length)) > -1);
		if (hasGrade && !hasGradeOverdueDate) {
			this._TipsService.showError('等级需要配合等级有效期使用！');
			return;
		}
		if (!hasGrade && hasGradeOverdueDate) {
			this._TipsService.showError('等级有效期需要配合等级使用！');
			return;
		}
		this.postObject = {
			firstLine: this.firstLine,
			itemList: this.valueList1
		};
		this.fileUploadSave();
	}

	fileUploadSave() {
		Resources.MemberInfoConfigPost.save({planId: this._PublicService.planId, importId: this.importId}, this.postObject).$promise
			.then(data => {
				console.log(data);
				this._$state.go('le.member.batchImport', {});
			})
			.catch(error => {
				console.log(error);
			});
	}
	cancel() {
		this._$state.go('le.member.batchImport');
	}

}

