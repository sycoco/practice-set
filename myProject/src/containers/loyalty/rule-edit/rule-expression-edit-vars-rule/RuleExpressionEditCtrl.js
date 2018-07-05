/**
 * @author wenjie.li
 * @since 2016-10-12
 */
import {Inject} from 'angular-es-utils';
import HeadTitleContainer from '../variable-head-title-container.tpl.html';

@Inject('$ccMenus', '$state', '$scope', 'TipsService', '$q', '$stateParams', 'exDataService')
export default class RuleExpressionEditCtrl {

	constructor() {
		// 自定义变量
		this.variable = this._$state.params['variable'] || (this._$state.go('le.member.information'));
		this.schemas = this._$state.params['schemas'];
		this.schemasName = this._$state.params['schemasName'];
		this.back = 'le.loyalty.' + this.schemas;
		this._$ccMenus.onShopChange(current => {
			this._$state.go('le.loyalty.' + this.schemas);
		});

		this._exDataService.getTheBtnData(data => {
			data = data.filter(item => item.name !== 'custom');
			this.contents = data;
		}, error => {
			this._TipsService.showError('数据加载有误,请刷新重试' + error);
		}, this.schemas);
		this.headTitleContainer = HeadTitleContainer;


		this.rule = this.variable.rule;
		const rules = [{
			name: this.variable.caption,
			caption: this.variable.caption,
			exprContent: this.variable.defaultRule
		}];
		this.rules = rules;
	}
	initConfigInfo() {
		this._$state.go('le.loyalty.' + this.schemas);
	}

	confirm() {
		if (this.rules[0].cheked) {
			this.variable.defaultRule = this.rules[0].exprContent;
			this._$state.go('le.loyalty.customVariable', {
				variable: this.variable
			});
		} else {
			this._TipsService.showError('表达式编辑有误,请检查');
		}
	}

	cancel() {
		this._$state.go('le.loyalty.customVariable');
	}

	insertExpressionContent(conent) {
		this._$scope.$broadcast('insertContent', conent);
	}

	con() {
		console.log(this.rules);
	}
}

