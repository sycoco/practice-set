/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-09-30 12:04
 */
import angular from 'angular';

import home from './other/Home';
import config from './other/config';
import exportList from './other/exportList';
import member from './member';
import loyalty from './loyalty';
import groupCard from './groupCard';
import TipsService from '../common/Services/TipsService';
import PublicService from '../common/PublicService';

export default angular
	.module('ccms.le.containers', [home, config, exportList, member, loyalty, groupCard])
  .service('TipsService', TipsService)
  .service('PublicService', PublicService)
	.name;

// 测试

// 测试打包
