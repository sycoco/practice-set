if (is_weixin == 1) {
	$("#s4 .share_weixin").show();
	$(".rule_box .main img").eq(0).show();
}
else{
	$("#s4 .share_weibo").show();
	$(".rule_box .main img").eq(1).show();
}

var tiaoguo = 1;
//切换gif
//cancelAnimationFrame(sequences1);
function s1_canvas(){
	TweenMax.to("#loading",0.8,{"autoAlpha":0});
	TweenMax.to("#s1",0.8,{"autoAlpha":1,onComplete:function(){
		/*var fps      = 10,
	    currentFrame = 0,
	    totalFrames  = 20,
	    canvas       = document.getElementById("s1_canvas"),
	    ctx          = canvas.getContext("2d"),
	    currentTime  = rightNow();
	    canvas.width = 640;
		canvas.height = 1040;
		(function animloop(time){
		    var delta = (time - currentTime) / 1000;
			if(Math.abs(delta) <1){
				currentFrame += (delta * fps);
			}  
		    var frameNum = Math.floor(currentFrame);
		    if (frameNum >= totalFrames) {
			  currentFrame = frameNum = totalFrames;
			  	TweenMax.delayedCall(1.5,function(){
		  			s1_canvas2();
		  		})
			  return;
		    }
			img = queue.getResult("s1_"+(frameNum+1));
		    sequences1 = requestAnimationFrame(animloop);
			drawFrame(ctx,img,640,1040,frameNum);
		    currentTime = time;
		})(currentTime);*/
	}});
	$("#gif_box").html(queue.getResult("s1_1"));
	TweenMax.delayedCall(3,function(){
		$("#gif_box").html(queue.getResult("s1_2"));	
		TweenMax.delayedCall(1,function(){
			$("#gif_box").html(queue.getResult("s1_2_2"));	
			tiaoguo = 2;
			$('#s2').css('background', 'url('+ queue.getResult("s1_2_2").src +')');
			TweenMax.to("#s1 .btn",0.8,{"autoAlpha":1});	
		})	
	})
}


//拧开瓶盖
/*function s1_canvas2(){
	var fps      = 10,
    currentFrame = 0,
    totalFrames  = 10,
    canvas       = document.getElementById("s1_canvas"),
    ctx          = canvas.getContext("2d"),
    currentTime  = rightNow();
    canvas.width = 640;
	canvas.height = 1040;
	(function animloop(time){
	    var delta = (time - currentTime) / 1000;
		if(Math.abs(delta) <1){
			currentFrame += (delta * fps);
		}  
	    var frameNum = Math.floor(currentFrame);
	    if (frameNum >= totalFrames) {
		  currentFrame = frameNum = totalFrames;
		  	TweenMax.to("#s1 .btn",0.8,{"autoAlpha":1});
		  return;
	    }
		img = queue.getResult("s1-2_"+(frameNum+1));
	    sequences2 = requestAnimationFrame(animloop);
		drawFrame(ctx,img,640,1040,frameNum);
	    currentTime = time;
	})(currentTime);
}*/

//加入注水接力
$("#s1 .btn").click(function(event) {
	show_s2();
	//_smq.push(['pageview','/intro','intro2']);
	//_smq.push(['custom','join','03_join1']);
});

var s2_timer;//定时器
//显示s2
function show_s2(){
	var canvas2 = document.getElementById("s2_canvas");
	var ctx2 = canvas2.getContext("2d");
	//drawFrame(ctx2,queue.getResult("s2_1"),640,1040);
	TweenMax.to("#s1",0.8,{"autoAlpha":0});
	TweenMax.to("#s2,.point",0.8,{"autoAlpha":1});
	s2_timer = setTimeout(function(){
		$(".point").hide();
		can_rotate = true;
		auto_play();
	},3000)
}
$(".point").click(function(event) {
	$(".point").hide();
	clearTimeout(s2_timer);
	can_rotate = true;
	auto_play();
});



//5秒没有倾斜自动播放
var auto_timer;
function auto_play(){
	auto_timer = setTimeout(function(){
		s2_canvas("center");
	},5000);
}



//倒水序列帧
function s2_canvas(src){
	TweenMax.set("#s2 canvas",{"autoAlpha":1,onComplete:function(){
		var fps      = 10,
	    currentFrame = 1,
	    totalFrames  = 30,
	    canvas       = document.getElementById("s2_canvas"),
	    ctx          = canvas.getContext("2d"),
	    currentTime  = rightNow();
	    canvas.width = 640;
		canvas.height = 1040;
		(function animloop(time){
		    var delta = (time - currentTime) / 1000;
			if(Math.abs(delta) <1){
				currentFrame += (delta * fps);
			}  
		    var frameNum = Math.floor(currentFrame);
		    if (frameNum >= totalFrames) {
			  currentFrame = frameNum = totalFrames;
			  TweenMax.to("#s2",0.8,{"autoAlpha":0});
			  TweenMax.to("#s3",0.8,{"autoAlpha":1});
			  //_smq.push(['pageview','/sample','info']);
			  tiaoguo = 3;
			  return;
		    }
			img = queue.getResult(""+ src +"_"+(frameNum+1));
		    sequences2 = requestAnimationFrame(animloop);
			drawFrame(ctx,img,640,1040,frameNum);
		    currentTime = time;
		})(currentTime);
		//_smq.push(['custom','act','04_rotate']);
	}});
}

//点击领取
$('#s2 .s2_2  .draw_btn').click(function(event) {
	TweenMax.to("#s2",0.8,{"autoAlpha":0});
	TweenMax.to("#s3",0.8,{"autoAlpha":1});
	//_smq.push(['pageview','/sample','info']);
	//_smq.push(['custom','info','06_sample']);
});


//显示规则
$('#s3 .rule_btn').click(function(event) {
	$(".rule_box").fadeIn();
	//_smq.push(['custom','info','07_rule']);
});
//关闭规则
$('.rule_box .close_btn').click(function(event) {
	$(".rule_box").fadeOut();
});

//跳过
$(".skip_btn").click(function(event) {
	TweenMax.to("#s1,#s2,.point",0.8,{"autoAlpha":0});
	TweenMax.to("#s3",0.8,{"autoAlpha":1});
	can_rotate = false;
	clearTimeout(auto_timer);
	clearTimeout(s2_timer);
	if (tiaoguo == 1) {
		//_smq.push(['custom','skip','01_skip1']);
	}
	else if(tiaoguo == 2) {
		//_smq.push(['custom','skip','02_skip2']);
	}
	else if(tiaoguo == 3) {
		//_smq.push(['custom','skip','05_skip3']);
	}
});

//同意提交个人信息
$('#s3 .icon').click(function(event) {
	$(this).toggleClass('show');
});


$("select").change(function(event) {
	$(this).siblings('span').html($(this).find('option:selected').text());
});

//表单
var can_submit = true ; 
$("#s3 .submit_btn").click(function(event) {
	var phone = $("#phone").val();
	var city = $("#city").find('option:selected').text();
	var shop = $("#shop").find('option:selected').text();
	if (phone == "") {
		alert("请填写手机号");
		return false;
	}
	else if(!isMobile(phone)){
		alert("请填写正确的手机号");
		return false;
	}
	if (city =="选择您所在的城市") {
		alert("请选择您所在的城市");
		return false;
	}
	if (shop =="选择您附近的柜台") {
		alert("请选择您附近的柜台");
		return false;
	}
	if(!$("#s3 .icon").hasClass('show')){
		alert("请同意提交个人信息");
		return false;
	}
	var data = {
		"phone" : phone,
		"city" : city,
		"shop" : shop
	}
	//_smq.push(['custom','info','11_submit']);
	//提交表单
	if (can_submit) {
		can_submit = false;
		$.ajax({
            url: "{:U('Index/saveInfo')}",
            type:'post',
            dataType:'json',
            data:data,            
            success:function(data){
                if(data.status == 1){
                	$("#s3 .success").fadeIn();
                	//_smq.push(['pageview','/sample','success']);
                }
                else if(data.status == 2){
                    alert("验证码有误");
                }
                else{
                    alert(data.msg);
                }

                can_submit = true;
            },
            error:function(){
                alert("网络繁忙");
                can_submit = true;                    
            }
        })
        //测试
        $("#s3 .success").fadeIn();
       // _smq.push(['pageview','/sample','success']);
    }
});

//注水接力
$("#s3 .success .next_btn").click(function(event) {
	TweenMax.to("#s3",0.8,{"autoAlpha":0});
	TweenMax.to("#s4",0.8,{"autoAlpha":1});
	//_smq.push(['custom','join','12_join2']);
});

//分享好友
$("#s4 .share_weixin").click(function(event) {
	$("#s4 .share").fadeIn();
	//_smq.push(['pageview','/share','share']);
	//_smq.push(['custom','share','14_share']);
});

//分享微博
$("#s4 .share_weibo").click(function(event) {
	
});


//中奖调用
/*function prize(){
	$("#s4 .share").fadeOut();
	$("#s4 .prize").fadeIn();
}*/

//陀螺仪
var can_rotate = false;
function deviceMotionHandler(eventData) { 
  var acceleration = eventData.accelerationIncludingGravity;      
  var rotate_num = Math.round(((acceleration.x) / 9.81) * -90); 
  if (can_rotate) {
	var ua = navigator.userAgent.toLowerCase();	
	if (/iphone|ipad|ipod/.test(ua)) {
	  	if (rotate_num <=-45) {
			//alert("右")
			s2_canvas("right");
			can_rotate = false;
			clearTimeout(auto_timer);
		}
		else if(rotate_num >=45){
			//alert("左");
			s2_canvas("left");
			can_rotate = false;
			clearTimeout(auto_timer);
		}
	} else if (/android/.test(ua)) {
	  	if (rotate_num <=-45) {
			//alert("左")
			s2_canvas("left");
			can_rotate = false;
			clearTimeout(auto_timer);
		}
		else if(rotate_num >=45){
			//alert("右");
			s2_canvas("right");
			can_rotate = false;
			clearTimeout(auto_timer);
		}
	}
  }
} 

if (window.DeviceMotionEvent) { 
    window.addEventListener('devicemotion',deviceMotionHandler, false); 
}else{ 
    alert('亲，你的浏览器不支持DeviceMotionEvent哦~'); 
}


//验证手机
function isMobile(mobile){
	var patt =/^1[34578]{1}\d{9}$/;
	var re = new RegExp(patt);  
	if(re.test(mobile)){
		return $.trim(mobile);
	}else{
		return false;
	}
}


//音乐
var music = document.getElementById("audio");
music.volume = 0.5;
$("#music-btn").click(function(event) {
	$(this).toggleClass('off');
	if($(this).hasClass('off')){
		music.pause();
	}else{
		music.play();
	}
});

$("#phone").click(function(event) {
	//_smq.push(['custom','info','08_number']);
});
$("#city").change(function(event) {
	//_smq.push(['custom','info','09_city']);
});
$("#shop").change(function(event) {
	//_smq.push(['custom','info','10_counter']);
});
$("#moblie").click(function(event) {
	//_smq.push(['custom','share','13_sharenumber']);
});




function alert(content){
	$("#alert p").text(content);
	$("#alert").fadeIn();
}
$("#alert .main .close").click(function(event) {
	$("#alert").fadeOut();
});