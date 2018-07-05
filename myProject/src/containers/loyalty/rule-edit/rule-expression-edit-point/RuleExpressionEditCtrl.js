/**
 * @author wenjie.li
 * @since 2016-10-12
 */
import {Inject} from 'angular-es-utils';

@Inject('$ccModal', '$ccMenus', '$state', '$scope', '$q', '$stateParams', 'exDataService', '$filter', 'TipsService')
export default class RuleExpressionEditCtrl {

	constructor() {
		this.rule = this._$state.params['pointRule'] || (this._$state.go('le.member.information'));
		this.schemas = this._$state.params['schemas'];
		this._$ccMenus.onShopChange(() => {
			this._$state.go('le.loyalty.' + this.schemas);
		});
		console.log('this.schemas');
		console.log(this.schemas);
		this.schemasName = this._$state.params['schemasName'] || (this._$state.go('le.member.information'));
		this.rules = [this.rule];
		this.firstEdit = this.rule.exprContent === '' || this.rule.exprContent === undefined;
		this.datalist3_2 = [{
			title: '立即执行',
			value: true
		}, {
			title: '指定时间',
			value: false
		}];
		this.rule = this.rules[0];
		let now = new Date();
		this.ruleStartDate = (this.rule && this.rule.ruleStartDate) ? new Date(this.rule.ruleStartDate) : now;
		this.minDate = (this.ruleStartDate - now > 0) ? now : this.ruleStartDate;
		if (this.rule.ruleContentConfig) {
			this.sendTime = {
				sendTimePeriod: this.rule.ruleContentConfig.sendTime.period === 0,
				periodAry: [this.rule.ruleContentConfig.sendTime.period === 0 ? 1 : this.rule.ruleContentConfig.sendTime.period]
			};
		} else {
			this.sendTime = {
				sendTimePeriod: true,
				periodAry: [0]
			};
		}
		this.loadVariablesContents();
	}

	/**
	 * 加载计算表达式所需四大变量
	 */
	loadVariablesContents() {
		this._exDataService.getTheBtnData(data => {
			this.contents = data;
			this.showContent = true;
		}, error => {
			this._TipsService.showError('数据加载有误,请刷新重试' + error);
		}, this.schemas);
	}

	save(open) {
		if (!this.rules[0].currentValid && this.rules[0].exprContent === '') {
			// 如果是关闭状态,且表达式为空,则可以保存
		} else {
			if (!this.rules[0].cheked) {
				this._TipsService.showError('表达式编辑有误,请检查');
				return;
			}
			if (!this.sendTime.sendTimePeriod && !this.sendTime.periodAry[0]) {
				this._TipsService.showError('请填写' + this.rule.cardPointPlanViewCaption + '发放时间');
				return;
			}
		}
		let rule = this.rules[0];
		let modalInstance = this._$ccModal.confirm('请确认是否' + (open ? '保存并开启' : '保存') + `${rule.cardPointPlanViewCaption}规则?`, () => {
		});
		modalInstance.open().result.then(() => {
			updateRules.bind(this)();
		}, () => {
		});
		function updateRules() {
			// 积分规则页面，输入早于当前时间，保存后展示的时间应为当前时间
			let date = this.ruleStartDate < new Date() ? new Date() : this.ruleStartDate;
			this.rule.ruleStartDate = this._$filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
			this.rule.ruleContentConfig = {
				sendTime: {
					at: 'finish', // 只能在确认收货后
					period: this.sendTime.sendTimePeriod ? 0 : this.sendTime.periodAry[0],
					unit: 'DAY' // 固定
				}
			};
			this._exDataService.updateRules(this.rules, {}, open).then(() => {
				if (open) {
					this.switchRule(this.rules[0], open, true);
				} else {
					this._TipsService.showSuccess('操作成功');
					this._$state.go('le.loyalty.' + this.schemas);
				}
			}, () => {
				this._TipsService.showError('操作失败');
			});
		}
	}

	switchRule(rule, open, afterSave) {
		const openStr = open ? '开启' : '关闭';
		if (open && !rule.cheked) {
			this._TipsService.showError(rule.exprContent ? '表达式有问题,请重新编辑后再开启' : '请先配置规则内容！');
			rule.currentValid = !open;
			return;
		}
		if (!afterSave && open && this.firstEdit) {
			this._TipsService.showError('请先保存再开启规则');
		}
		if (afterSave) {
			openThePointRule.call(this)();
		} else {
			let modalInstance = this._$ccModal.confirm(`请确认是否${openStr}${rule.cardPointPlanViewCaption}规则？`, () => {
			});
			modalInstance.open().result.then(() => {
				openThePointRule.call(this)();
			}, () => {
				rule.currentValid = !open;
			});
		}

		function openThePointRule() {
			this._exDataService.openThePointRule(rule, open).then(() => {
				rule.currentValid = open;
				this._TipsService.showSuccess(afterSave ? '保存并开启成功' : '操作成功');
				if (afterSave) {
					this._$state.go('le.loyalty.' + this.schemas);
				}
			}, () => {
				this._TipsService.showError(afterSave ? '保存成功但是开启失败' : '操作失败');
			});
		}

	}

	cancel() {
		this._$state.go('le.loyalty.' + this.schemas);
	}

	con() {
		console.log('点击了计算表达是框! 打印当前获取到的rules');
		console.log(this.rules);
		console.log(this.contents);
	}

	showTip() {
		let modalInstance = this._$ccModal.confirm('您必须先关闭规则才能修改，当规则关闭后，规则关闭前已经下单的订单仍会计算并发放积分，是否需要关闭规则？', () => {
		});
		modalInstance.open().result.then(() => {
			this.switchRule(this.rule, false);
		}, () => {
		});
	}
}

