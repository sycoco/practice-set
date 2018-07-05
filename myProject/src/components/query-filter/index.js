/**
 * Created by zhouxing on 2016/10/19.
 */
import angular from 'angular';
import template from './template.tpl.html';
import {QueryFilterCtrl} from './controller';
import './_queryFilter.scss';

const queryFilter = {
	template,
	controller: QueryFilterCtrl,
	transclude: true,
	bindings: {
		filters: '<?',
		queryFn: '&?',
		isScreening: '<?',
		expand: '=?'
	}
};

const onFinishRenderFilters = {
	restrict: 'A',
	link: function($scope, element, attributes) {
		if ($scope.$last === true) {
			$scope.$parent.$ctrl.complete();
		}
	}
};

export default angular.module('le.components.queryFilter', [])
	.component('queryFilter', queryFilter)
	.directive('onFinishRenderFilters', () => onFinishRenderFilters)
	.name;
