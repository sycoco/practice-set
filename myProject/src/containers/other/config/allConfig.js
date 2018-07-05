/**
 * Created by liwenjie on 2017/3/9.
 */

const CONFIG_RESOURS = {
	// 创建一个登陆用户
	RegisterResource: 'RegisterResource',
	// 添加一个租户级会员卡计划
	AddOrgedPlansResource: 'AddOrgedPlansResource',
	// 添加一个店铺级会员卡计划
	AddShopPlansResource: 'AddShopPlansResource',
	// 添加一个新的等级计划
	AddGradesPlanResource: 'AddGradesPlanResource',
	// 为一个等级计划添加一个新的等级
	AddGradeForOnePlanResource: 'AddGradeForOnePlanResource',
	// 查看此等级计划的等级列表
	GetGradesPlanResource: 'GetGradesPlanResource',
	// 添加一个新的积分计划
	AddPointsPlanResource: 'AddPointsPlanResource',
	// 添加一个完整的积分计算元数据信息
	AddSchemasPropertiesResource: 'AddSchemasPropertiesResource',
	// 添加一个完整的等级 计算元数据信息
	AddSchemasResource: 'AddSchemasResource',
	// 添加系统级的会员元数据
	AddSystemPropertiesResource: 'AddSystemPropertiesResource'
};
const CONFIG_ARRY = [
	// {
	// 	resource: CONFIG_RESOURS.RegisterResource,
	// 	girdCaption: '添加一个新的登陆用户',
	// 	columnsDef: [{
	// 		caption: '租户ID',
	// 		fieldName: 'orgId',
	// 		description: '租户ID'
	// 	}, {
	// 		caption: '用户名',
	// 		fieldName: 'username',
	// 		description: '用户名'
	// 	}, {
	// 		caption: '昵称',
	// 		fieldName: 'nickName',
	// 		description: '昵称'
	// 	}, {
	// 		caption: '密码',
	// 		fieldName: 'password',
	// 		description: '密码'
	// 	}]
	// },
	// {
	// 	resource: CONFIG_RESOURS.AddOrgedPlansResource,
	// 	girdCaption: '添加一个租户级会员卡计划',
	// 	columnsDef: [{
	// 		caption: '计划名称',
	// 		fieldName: 'caption',
	// 		description: '计划名称'
	// 	}, {
	// 		caption: '绑卡策略',
	// 		fieldName: 'bindStrategy',
	// 		option: [{title: 'AUTO 自动', value: 'AUTO'}, {title: 'MANUAL 手动', value: 'MANUAL'}]
	// 	}, {
	// 		caption: '策略名',
	// 		fieldName: 'numberGenerateStrategyName',
	// 		description: '卡号生成策略配置名',
	// 		value: 'NAME',
	// 		option: [{title: 'NAME', value: 'NAME'}]
	// 	}, {
	// 		caption: '参数',
	// 		fieldName: 'numberGenerateConfigValue',
	// 		value: '{}',
	// 		description: '卡号生成策略的相应参数,如果有, json化表示'
	// 	}]
	// },
	{
		resource: CONFIG_RESOURS.AddShopPlansResource,
		girdCaption: '添加一个单位级会员卡计划',
		columnsDef: [{
			caption: '选择单位',
			fieldName: 'unitId',
			description: '相应的经营单位的id',
			shopSelect: true
		}, {
			caption: '计划名称',
			fieldName: 'catpion',
			description: '计划名称'
		}, {
			caption: '绑卡策略',
			fieldName: 'bindStrategy',
			option: [{title: 'AUTO 自动', value: 'AUTO'}, {title: 'MANUAL 手动', value: 'MANUAL'}]
		}, {
			caption: '策略名',
			fieldName: 'numberGenerateStrategyName',
			value: 'NAME',
			option: [{title: 'NAME', value: 'NAME'}]
		}, {
			caption: '参数',
			fieldName: 'numberGenerateConfigValue',
			value: '{}',
			description: '此卡号生成策略的相应参数,如果有, json化表示'
		}]
	},
	{
		resource: CONFIG_RESOURS.AddGradesPlanResource,
		girdCaption: '添加一个新的等级计划',
		columnsDef: [{
			caption: '选择单位',
			fieldName: 'planId',
			description: '获取卡计划',
			shopSelect: true
		}, {
			caption: '计划名称',
			fieldName: 'caption',
			description: '等级计划名称, 字数建议不要超过十个字'
		}, {
			caption: '显示名称',
			fieldName: 'viewCaption',
			value: '等级',
			description: '等级名称, 字数建议不要超过四个字, 比如 爵位 官阶 学位'
		}, {
			caption: '平台id',
			fieldName: 'platId',
			description: '如果绑定了平台,平台id -10001表示淘宝',
			value: '-10001'
			// option: [{title: '淘宝-10001', value: '-10001'}]
		}]
	},
	{
		resource: CONFIG_RESOURS.AddGradeForOnePlanResource,
		girdCaption: '为一个等级计划添加一个新的等级',
		columnsDef: [{
			caption: '选择单位',
			fieldName: 'planId',
			description: '获取卡计划',
			shopSelect: true
		}, {
			caption: '选择等级计划',
			fieldName: 'gradeId',
			description: '获取等级计划ID',
			option: [{title: '请先选择单位', value: '1'}],
			gradeSelect: true
		}, {
			caption: '显示名称',
			fieldName: 'caption',
			description: '显示名称, 字数建议不要超过四个字, 比如 骑士 上校 中学生'
		}, {
			caption: '排序',
			fieldName: 'order',
			description: '排序号,用于表示优先级,越小的等级越低， 建议设置为 100 200 300 .. 预留等级顺序的调整空间'
		}, {
			caption: '保底等级',
			fieldName: 'bottom',
			option: [{title: '是', value: true}, {title: '不是', value: false}]
		}]
	},
	{
		resource: CONFIG_RESOURS.AddPointsPlanResource,
		girdCaption: '添加一个新的积分计划',
		columnsDef: [
			{
				caption: '选择单位',
				fieldName: 'planId',
				description: '获取卡计划',
				shopSelect: true
			},
			{fieldName: 'caption', caption: '显示名称', description: '显示名称'},
			{fieldName: 'viewCaption', caption: '积分单位的显示', description: '积分的单位 例如：积分 京豆'},
			{fieldName: 'postfix', caption: '积分的单位', description: '积分的单位 例如：积分 京豆'},
			{
				fieldName: 'enabled',
				caption: '状态值',
				description: '选择启用则会马上生效',
				option: [{title: '启用', value: true}, {title: '禁用', value: false}]
			},
			{
				fieldName: 'useStrategy',
				caption: '策略 ',
				description: '积分使用策略 可选值 INNER | FULL | CONSUME',
				option: [{title: '仅对内INNER', value: 'INNER'}, {title: '全通用FULL', value: 'FULL'}, {
					title: '仅消费CONSUME',
					value: 'CONSUME'
				}]
			},
			{
				fieldName: 'negativeDeductable',
				caption: '允许负积分',
				description: '允许负积分扣除',
				option: [{title: '允许', value: true}, {title: '不允许', value: false}]
			},
			{fieldName: 'overdueStrategyName', caption: '过期策略', description: '过期策略以后可以更改',
				option: [{title: '单笔过期EVERY', value: 'EVERY'}, {title: '统一过期UNIFIED', value: 'UNIFIED'}, {title: '永不过期NEVER', value: 'NEVER'}]},
			{fieldName: 'overdueStrategyContent', caption: '过期策略参数', description: '过期策略的参数设置'},
			{fieldName: 'gathered', caption: '是否采用积分汇总', description: '是否采用积分汇总( 租户内经营单位专用)',
				option: [{title: '是', value: true}, {title: '不是', value: false}]},
			{fieldName: 'gatherStrategy', caption: '汇总处理方式', description: '积分汇总的处理方式 如：UNIT_UNION',
				option: [{title: '经营单位联合UNIT_UNION', value: 'UNIT_UNION'}, {title: '系统集成SYSTEM_INTEGRAL', value: 'SYSTEM_INTEGRAL'}]}
		]
	},
	{
		resource: CONFIG_RESOURS.AddSystemPropertiesResource,
		girdCaption: '添加系统级的会员元数据',
		columnsDef: [
			{fieldName: 'name', caption: '名称', description: '唯一编码 例如 sex'},
			{fieldName: 'caption', caption: '显示名称', description: '显示名称 如：性别'},
			{fieldName: 'desc', caption: '描述', description: '描述 如 会员的性别信息'},
			{fieldName: 'dataType', caption: '数据类型',
				option: [{title: 'LONG', value: 'LONG'}, {title: 'DOUBLE', value: 'DOUBLE'}, {title: 'STRING', value: 'STRING'}, {title: 'DATE', value: 'DATE'}, {title: 'TIME', value: 'TIME'}, {title: 'ENUMS', value: 'ENUMS'}, {title: 'DATETIME', value: 'DATETIME'}, {title: 'BOOLEAN', value: 'BOOLEAN'}]},
			{fieldName: 'postfix', caption: '后缀', description: '显示后缀,如果有,如身高 cm'}
		]
	},
	{
		resource: CONFIG_RESOURS.AddSchemasPropertiesResource,
		girdCaption: '添加一个完整的积分计算元数据信息',
		columnsDef: [],
		onlyCodeStyle: true,
		codeStyle: true
	},
	{
		resource: CONFIG_RESOURS.AddSchemasResource,
		girdCaption: '添加一个完整的等级 计算元数据信息',
		columnsDef: [],
		onlyCodeStyle: true,
		codeStyle: true
	}];

export { CONFIG_RESOURS, CONFIG_ARRY };
