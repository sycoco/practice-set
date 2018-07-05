/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-20
 */

export default {
	LOYALTY: {
		abstract: true,
		params: {
			variable: null,
			ruleIndex: null,
			schemaId: null,
			gradeId: null,
			editingRule: null,
			editingLevelRule: null,
			schemas: 'order',
			schemasName: ''
		},
		template: '<ui-view />'
	}
};
