var shop_info=[
			{
				"address":"北京",
				"shop_address":["北京复兴门百盛","北京双安","北京新世界","北京百货大楼","北京阜成门华联","北京翠微","北京汉光百货","北京新世界三期","北京新世界四期","北京大兴王府井","北京顺义新世界","北京翠微大厦龙德店","北京apm旗舰店"]
			},
			{
				"address":"成都",
				"shop_address":["成都王府井","成都伊藤双楠","成都王府井购物中心","成都群光广场","成都乐天百货","伊势丹百货","成都万象城","成都凯德金牛旗舰店"]
			},
			{
				"address":"广州",
				"shop_address":["广州正佳广场店","广州广百","广州正佳友谊","广州广百中怡","广州天河城"]
			},
			{
				"address":"哈尔滨",
				"shop_address":["哈尔滨南岗松雷","哈尔滨远大","哈尔滨百盛"]
			},
			{
				"address":"杭州",
				"shop_address":["杭州银泰武林店","杭州大厦","杭州解百","杭州银泰西湖店","杭州银泰庆春店","杭州萧山银隆","杭州银泰城西店"]
			},
			{
				"address":"合肥",
				"shop_address":["合肥商之都","合肥鼓楼","合肥百盛","合肥大洋百货"]
			},
			{
				"address":"济南",
				"shop_address":["济南银座商城","济南银座购物广场","济南银座洪楼店"]
			},
			{
				"address":"南京",
				"shop_address":["南京大洋","南京金鹰国际","南京中央","南京大洋桥北店","南京新百"]
			},
			{
				"address":"上海",
				"shop_address":["上海淮海百盛","上海太平洋徐家汇店","上海置地广场","上海东方商厦南东店","上海久光百货","上海第一八佰伴","上海巴黎春天五角场店","上海莘庄百盛","上海新世界百货","上海永安百货","上海巴黎春天浦建店","大丸百货店","正大广场店","上海美罗城店","百联又一城"]
			},
			{
				"address":"深圳",
				"shop_address":["深圳茂业华强北","深圳茂业东门","深圳太阳百货","深圳南山天虹","深圳南山茂业","深圳海雅缤纷城旗舰店"]
			},
			{
				"address":"沈阳",
				"shop_address":["沈阳中兴","沈阳百盛","沈阳新玛特","沈阳兴隆大家庭"]
			},
			{
				"address":"苏州",
				"shop_address":["苏州石路国际","苏州美罗商城观前店"]
			},
			{
				"address":"乌鲁木齐",
				"shop_address":["乌鲁木齐天百","乌鲁木齐友好百盛","乌鲁木齐友好商场","乌鲁木齐太百购物","乌鲁木齐北京路汇嘉时代"]
			},
			{
				"address":"武汉",
				"shop_address":["武汉群光店","武商广场","武汉王府井","武汉大洋中山店","武汉中商广场","武汉大洋光谷店","武商众圆广场"]
			},
			{
				"address":"西安",
				"shop_address":["西安世纪金花","西安开元","西安金鹰","西安小寨百盛","西安民生","西安世纪金花赛高店","西安西大街百盛","西安金花高新店","西安东二环百盛","西安赛格国际购物中心"]
			},
			{
				"address":"长沙",
				"shop_address":["长沙平和堂","长沙王府井","长沙友谊商城"]
			},
			{
				"address":"郑州",
				"shop_address":["郑州金博大","郑州丹尼斯(人民店)","郑州百盛","郑州大商新玛特国贸","郑州北京华联","郑州王府井"]
			},
			{
				"address":"重庆",
				"shop_address":["重庆世纪新都","重庆凯瑞商都","重庆涪陵商都","重庆瑞成商都","重庆万州商都","重庆茂业百货"]
			},
		];
jQuery(document).ready(function($) {
	//补全地区
	for(var i=0;i<=shop_info.length-1;i++){
		var option='<option value="'+shop_info[i].address+'">'+shop_info[i].address+'</option>'
		$("#city").append(option);
	}
	//预约地区改变
	$("#city").change(function(event) {
		var val=$(this).val();
		if ($(this).val()!="选择您所在的城市") {
			for(var i=0;i<=shop_info.length-1;i++){				
				if (shop_info[i].address==val) {					
					$("#shop").html('<option value="选择您附近的柜台">选择您附近的柜台</option>');
					$("#shop").siblings('span').text("选择您附近的柜台");
					for(var j=0;j<=shop_info[i].shop_address.length-1;j++){
						var htm='<option value="'+shop_info[i].shop_address[j]+'">'+shop_info[i].shop_address[j]+'</option>';						
						$("#shop").append(htm);						
					};
				};
			}
		}else{
			$("#shop").html('<option value="选择您附近的柜台">选择您附近的柜台</option>');
			$("#shop").siblings('span').text("选择您附近的柜台");
		}
	});
});