/**
 * Created by zhouxing on 2016/10/19.
 */
// import angular from 'angular';
import {Inject} from 'angular-es-utils';
import angular from 'angular';

@Inject('$timeout', '$element', '$scope')
export class QueryFilterCtrl {

	$onInit() {
		this.expand = this.expand || true;
		this.hideExpand = true;
		if (this.filters.length !== 0) {
			this.filters[this.filters.length - 1].isLast = true;
			let className = '';
			let i = this.filters.length - 1;
			do {
				className = `.filterItem-${i}`;
				i = i - 1;
			} while (!this.filters[i + 1].displayName);
			window.onresize = () => {
				let elm = angular.element(document.querySelector(`${className}`))[0];
				if (elm) this.hideExpand = (elm.offsetTop < 30);
				if (elm) this._$scope.$digest();
			};
			this._$timeout(() => {
				window.onresize();
			});

		}
	}
	valueChage() {
		// 点击积分详情，跳到积分变更记录的时候，如果会员昵称的值变了，就要把那个ID的参数给干掉 这里有个坑（只监听了字符串输入框的变化）
		this.filters.forEach(item => {
			if (!item.displayName) item.values = [];
		});
	}


	$postLink() {
		this.reset = () => {
			this.filters.forEach(item => {
				item.values = [];
			});
			this._$scope.$broadcast('clearValues');
		};
	}

}
