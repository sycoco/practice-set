/**
 * create Jocs
 */
// const params = {
// 	isKeywordAnd: 'true',
// 	isOnsale: 'all',
// 	isSelectorSearch: 0,
// 	keywords: [],
// 	maxPrice: null,
// 	minPrice: null,
// 	numiid: null,
// 	page: 1,
// 	pagesize: 20,
// 	productCustomCategoryVO: {
// 		leafCid: []
// 	},
// 	productOuterVO: {
// 		endCutBit: '',
// 		outerCutFlag: 'false',
// 		outerId: null,
// 		startCutBit: ''
// 	},
// 	productSkuVO: {
// 		outerId: null,
// 		skuName: null
// 	},
// 	productStandardCategoryClustersVO: {},
// 	query: '',
// 	shopId: '',
// 	sortname: '',
// 	sortorder: '',
// 	tagsIds: []
// };
const params = {
	page: 1, // 当前页数
	pagesize: 20, // 每页显示条数
	pageSize: 20, // 每页显示条数(与pagesize相同,任一均可)
	minPrice: undefined, // 商品价格最小值(包括)
	maxPrice: undefined, // 商品价格最大值(包括)
	numIid: undefined, // 商品id值
	query: '衣服', // 商品标题值,模糊查询值
	leafCidChoice: undefined
};
export default params;
