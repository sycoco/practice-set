/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-09-30 14:31
 */
import './config';
import genResource, { defaultHttpConfigs } from 'angular-es-utils/rs-generator';
import angular from 'angular';
import injector from 'angular-es-utils/injector';

defaultHttpConfigs.withCredentials = true;

let tips = null;
defaultHttpConfigs.interceptor = {
	responseError: rejection => {
		const status = rejection.status;
		const data = (rejection.data.id && JSON.parse(rejection.data.id)) || rejection.data;
		switch (status) {
			case 401:
			case 403:
			case 500:
			case 502:
			case 503:
				tips && tips.element && tips._destroy();
				if (!tips || !tips.element) {
					const element = document.querySelector('.modal-body');
					tips = injector.get('$ccTips').error(data.message || '系统异常，请联系技术支持', element || undefined);
				}
				break;
		}
		return injector.get('$q').reject(rejection);
	}
};

const Resource = {
	MenuResource: genResource(`/web-portal/module/${window.TENANT}/newloyalty`, true),
	// MenuResource: genResource('/menus'),
	ShopResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/user/units/current`),
	CardListResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/orged/current`),

	PlanResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/united/init/:unitId`, false, undefined, undefined, {
		transformResponse: data => ({ planId: data })
	}), // 根据指定的店铺进入并获取到当前店铺的会员卡计划
	MenuPointsResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/metas/schemas`),
	// 所有子路由可配置项:
	MenuAllPointsResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/orged/current/independentSchema`),

	// // 商品选择器相关接口
	// ProductResource: genResource(`${window.API_HOST}/web-rocket/v1/product/selector/snapshoot/:snapshootId/product/`),
	// ProductSelectorResource: genResource(`${window.API_HOST}/web-rocket/v1/product/selector/`),
	// ProductSearchPageResource: genResource(`${window.API_HOST}/web-rocket/v1/product/selector/search/page/`),
	// ProductCountResource: genResource(`${window.API_HOST}/web-rocket/v1/product/selector/snapshoot/:snapshootId/product/count/`),

	// 商品选择器相关接口
	ProductClassifyResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}${window.ITEM_CATALOGS}`), // 获取商品分类
	ProductSearchPageResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}${window.COMPATIBLE}`), // 获取商品列表

	// 权限控制
	JurisdictionResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/rbac/session/permission`),
	// JurisdictionResource: genResource('/JurisdictionResource')
	allConfigResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/system/config`),

	// 独立部署的登陆
	// 获取settion
	SessionResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/rbac/session/token`)
	// 登陆
	// LoginResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/rbac/session/login`),
	// 退出操作
	// LogoutResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/rbac/session/logout`)

};

// 会员信息管理
const Member = {
	MemberInformationResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/simple`), // 会员总览
	MemberPointsRecords: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/points/records`), // 积分变更记录
	MemberGradesRecords: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/grades/records`), // 等级变更记录
	MemberMetasRecords: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/metas/records`), // 信息变更记录
	MemberGradePlan: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades`), // (获取相应的等级计划)
	MemberGradePlanConfig: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/:gradeId/configs`), // (获取相应的等级列表)
	MemberPointPlan: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/`), // (获取相应的积分计划)
	MemberInfoPlan: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/:memberId/`), // (指定会员的处理)
	MemberPointsGain: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/:memberId/points/:pointPlanId/records/handle/gain/`), // (增加积分)
	MemberPointsDeduct: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/:memberId/points/:pointPlanId/records/handle/deduct/`), // (减少积分)
	MemberMetasEdit: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/:memberId/metas/`), // (修改会员元数据)
	MemberGradeEdit: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/grades/manualimport/`), // (修改会员等级)
	MemberInfoUpload: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/import/`, false, undefined,
		{
			upload: {
				method: 'POST',
				transformRequest: angular.identity,
				headers: { 'Content-Type': undefined }
			}
		},
		{
			transformResponse: data => ({ id: data })
		}
	), // (导入会员信息)
	MemberInfoUploadPlay: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/import/:importId`), // (展示导入的记录信息)
	MemberInfoConfig: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/import/items`), // (返回可用的下拉配置项)
	MemberInfoConfigPost: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/import/:importId/handle`), // (配置列后导入数据)
	MemberUploadRecord: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/import/record`), // (列出上传文件后的处理记录)
	MemberFailUploadDownload: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/import/:importId/fail`), // (下载失败列表)

	MemberFileExport: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/export/:exportType`), // 创建文件导出任务
	MemberFileExportRecord: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/export/record`) // 创建文件导出任务
};

// 忠诚度管理
const Loyalty = {
	// 规则编辑三页面的三接口:

	// 0 新 自定义变量
	CustomVarsListAryResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/metas/schemas/:schemas/catalog`),
	CustomVarsListResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/vars/schemas/:schemas/sub/:currentSchemaId`),
	// 1 自定义变量
	// CustomVarListResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/vars/schemas/:schemas`),
	CustomVarResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/vars/:varId`),

	// 2 通用变量
	RulesSchemasResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/metas/schemas/:schemas/:basal`),
	// RulesSchemasResource: genResource('/RulesSchemasResource'),

	// 3 函数列表
	RulesExprFunctionResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/metaext/CardPointPlanRuleExprFunction`),
	// RulesExprFunctionResource: genResource('/RulesExprFunctionResource'),

	// metaClass
	MetaResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/metaext/:metaClass`, true), // 获取指定类型下的所有可用配置列表
	// MetaResource: genResource('/:metaClass'),
	// custom-variable
	MetaMemberResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/meta/members/properties/orgs/:type/:cardPlanId`), // 查询出当前租户会员元数据

	// MemberCardsSettingLevel: genResource('/memberCardSettingLevel'),
	MemberCardsSettingLevel: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/:gradeId/configs`),

	MemberCardsSettingPlantPoints: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/`),

	// 获取会员卡计划相关信息
	MemberCardsInfo: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId`),
	// Rules
	// RulesResource: genResource('/RulesResource'),
	RulesResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/rules/schemas/:schemas`),

	// RulesMetasResource: genResource('/RulesMetasResource'),
	RulesMetasResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/metas/schemas/:schemas/`),
	GradesMetasResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/metas/properties/`),
	GradesSwitchEnble: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/:gradeId/rules/enabled/`),

	UpdateRulesResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/:pointId/rules/:ruleUnionId`),
	SwitchRulesResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/:pointId/rules/:ruleUnionId/enabled`),
	RulesNameResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/:pointId`),
	// RulesNameResource: genResource('/points')

	// 获取当前的等级计划以及各个等级设置
	GradesResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades`), // (获取相应的等级计划)
	GradesConfigsResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/:gradeId/configs`), //	(获取相应的具体等级列表)
	GradesMGResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/mg/plats/:platId/grades/`), // (列出指定平台下的等级列表)
	GradesRuleListesource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/:gradeId/rules/`), // (列出指定平台下的等级列表)
	GradesGradListesource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/:gradeId/configs`),


	// 修改等级计划中的等级设置
	GradesConfigModifyResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/:gradeId/configs/:configId`),
	// 修改等级计划中的等级设置
	PointsOverDueResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/:pointId/overdue/`)
};

// 会员互动管理
const MemberInteraction = {};

// 集团卡
const GroupCard = {
	// 获取集团卡积分列表
	GroupCardPointPlantList_GET: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:cardId/points`),
	// 集团卡获取店铺积分计划和集团卡计划的绑定关系 修改
	GroupCardPointPlantBindCardPlant_PUT: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/orged/current/:cardId`),
	// 集团卡获取店铺积分计划和集团卡计划的绑定关系 获取
	GroupCardPointPlantBindCardPlant_GET: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/orged/current/:cardId/pointGather`),
	// 获取所有集团卡的所有积分计划和集团卡计划的绑定关系 获取
	GroupCardAllPointPlantBindCardPlant_GET: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/orged/current/pointGather`),
	// 获取所有店铺的积分计划
	GroupCardAllPointRule_GET: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/orged/current/pointPlan`),

	// 集团卡积分查询
	CardMemberPointsRecords: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/members/:planId/points/records/groupCard`)
};

// 初始化配置相关：
const initConfig = {
	// 创建一个登陆用户
	RegisterResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/rbac/session/register/:orgId`),
	// 添加一个租户级会员卡计划
	AddOrgedPlansResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/orged/`),
	// 添加一个店铺级会员卡计划
	AddShopPlansResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/united/`),
	// 添加一个新的等级计划
	AddGradesPlanResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/`),
	// 为一个等级计划添加一个新的等级
	AddGradeForOnePlanResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/:gradeId/configs/`),
	// 查看此等级计划的等级列表
	GetGradesPlanResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/grades/:gradeId/configs/`),
	// 添加一个新的积分计划
	AddPointsPlanResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/member/plans/:planId/points/`),
	// 添加一个完整的积分计算元数据信息
	AddSchemasPropertiesResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/meta/points/schemas/properties/`),
	// 添加一个完整的等级 计算元数据信息
	AddSchemasResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/meta/grades/schemas/properties/`),
	// 添加系统级的会员元数据
	AddSystemPropertiesResource: genResource(`${window.API_HOST}/${window.SERVICE_NAME}/meta/members/properties`)
};
const Resources = Object.assign(Resource, Member, Loyalty, MemberInteraction, GroupCard, initConfig);
export default Resources;
