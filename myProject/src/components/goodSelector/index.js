/**
 * @author Jocs
 * @since 2016-11-24
 */

import angular from 'angular';
import GoodSelector from './goodSelector';

import './index.scss';

export default angular.module('components.bm.goodSelector', [])
	.factory('goodSelector', GoodSelector)
	.name;
