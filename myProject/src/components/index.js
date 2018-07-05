/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

import angular from 'angular';

import ruleEditor from './rule-editor';
import expression from './expression';
import expressionBtn from './expression-btn';
import timeLine from './timeLine';
import foldingBarContainer from './folding-bar-container';
import dayPicker from './day-picker';
import queryFilter from './query-filter';
import metaDataInput from './meta-data-input';
import yearMonthPicker from './year-month-picker';
import timeInput from './time-input';
import validitySetting from './validity-setting';
import goodSelector from './goodSelector';

export default angular
	.module('ccms.le.components', [
		expression,
		expressionBtn,
		ruleEditor,
		timeLine,
		foldingBarContainer,
		dayPicker,
		metaDataInput,
		queryFilter,
		yearMonthPicker,
		timeInput,
		validitySetting,
		goodSelector
	])
	.name;
