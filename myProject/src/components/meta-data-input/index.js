/**
 * Created by liwenjie on 2016/10/19.
 */

import angular from 'angular';
import './_style.scss';
import template from './template.tpl.html';
import metaDataInputController from './controller.js';

// INPUT_STR(“字符串输入框"),
// INPUT_FLO(“浮点输入框"),
// INPUT_INT(“整型输入框"),
// RADIO("单选型"),
// CHECKBOX("多选项"),
// SELECT(“单选列表"),
// SELECT_MULTI(“多选列表”),
// GOODS("商品选择器"),
// SHOP("店铺选择器"),
// DATE_UNI_ALL(“时间选择 单个输入框” 选择日期和时间),
// DATE_UNI_YMD(“时间选择 单个输入框” 仅选择日期),
// DATE_SEP_YMD(“时间选择 三个输入框 ” 选择年月日),
// DATE_SEP_MD(“时间选择 三个输入框 ” 选择年月日),
// FLAG(“旗帜选择器”),

// 说明:
// viewType 基本输入类型
// options 双向绑定可选值
// values 双向绑定值数组  注意是数组
// logic 双向绑定逻辑
// suffix 输入框后缀名

// 校验功能:
// 1 整形 浮点型 输入限制
// 2 选择介于的时候, 后者自动大于前者, 前者自动小于后者

// TODO 1 商品选择器 2 时间范围的年月日组件

const ddo = {
	restrict: 'E',
	template,
	controller: metaDataInputController,
	controllerAs: '$ctrl',
	bindToController: true,
	scope: {
		caption: '@?',
		placeholder: '@?',
		uid: '@?',
		errorInput: '=?',
		inputDataType: '@?',
		viewType: '@?',
		values: '=?',
		options: '=?',
		suffix: '@?',
		logic: '=?',
		metaClick: '&?',
		hideLogic: '@?',
		minValue: '=?',
		maxValue: '=?',
		needCheck: '@?',
		validator: '@?',
		dateMax: '=?',
		valueChange: '&?',
		disable: '=?',
		valueChage: '&?',
		autoFill: '=?',
		allowNegative: '=?'
	}
};
export default angular.module('le.components.directive.medaDataInput', [])
.directive('leMetaDataInput', () => ddo)
	.name;
