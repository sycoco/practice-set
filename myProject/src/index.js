/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-19
 */
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngResource from 'angular-resource';
import components from './components';
import containers from './containers';
import LEMainController from './app.js';

export default angular.module('ccms.le', [uiRouter, ngResource, containers, components])
	.controller('LEMainController', LEMainController)
	.name;
