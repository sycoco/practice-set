
if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
    var version = parseFloat(RegExp.$1);
    if(version>2.3){
      var phoneScale = parseInt(window.screen.width)/640;
      document.write('<meta name="viewport" content="width=640, minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi">');
    }else{
      document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
    }
}else{
    document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
}



/*********************************************
requestAnimationFrame
**********************************************/
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/*********************************************
drawFrame 在canvas上绘制img
**********************************************/
function drawFrame(ctx, image, width, height, num) {
  var offsetY = 0,
      offsetX = 0;
  ctx.clearRect(offsetX,offsetY,width,height);
  ctx.drawImage(image, offsetX, offsetY, width, height, 0, 0, width, height);
  
}

/*********************************************
rightNow 获取当前时间
**********************************************/
function rightNow() {
  if (window['performance'] && window['performance']['now']) {
    return window['performance']['now']();
  } else {
    return +(new Date());
  }
}


/*********************************************
 Preload 预加载图片
 **********************************************/
 var queue = new createjs.LoadQueue();
 function preload(){
   queue.installPlugin(createjs.Sound);
   var i = 0;
queue.on("progress", handleLoadStart);
queue.on("complete", handleComplete);
queue.setMaxConnections(5);
queue.loadManifest([
/*{id:"s1_1",src:"images/s1/Page1_00000.jpg"},
{id:"s1_2",src:"images/s1/Page1_00001.jpg"},
{id:"s1_3",src:"images/s1/Page1_00002.jpg"},
{id:"s1_4",src:"images/s1/Page1_00003.jpg"},
{id:"s1_5",src:"images/s1/Page1_00004.jpg"},
{id:"s1_6",src:"images/s1/Page1_00005.jpg"},
{id:"s1_7",src:"images/s1/Page1_00006.jpg"},
{id:"s1_8",src:"images/s1/Page1_00007.jpg"},
{id:"s1_9",src:"images/s1/Page1_00008.jpg"},
{id:"s1_10",src:"images/s1/Page1_00009.jpg"},
{id:"s1_11",src:"images/s1/Page1_00010.jpg"},
{id:"s1_12",src:"images/s1/Page1_00011.jpg"},
{id:"s1_13",src:"images/s1/Page1_00012.jpg"},
{id:"s1_14",src:"images/s1/Page1_00013.jpg"},
{id:"s1_15",src:"images/s1/Page1_00014.jpg"},
{id:"s1_16",src:"images/s1/Page1_00015.jpg"},
{id:"s1_17",src:"images/s1/Page1_00016.jpg"},
{id:"s1_18",src:"images/s1/Page1_00017.jpg"},
{id:"s1_19",src:"images/s1/Page1_00018.jpg"},
{id:"s1_20",src:"images/s1/Page1_00019.jpg"},

//拧盖子
{id:"s1-2_1",src:"images/s1/Page2_00000.jpg"},
{id:"s1-2_2",src:"images/s1/Page2_00001.jpg"},
{id:"s1-2_3",src:"images/s1/Page2_00002.jpg"},
{id:"s1-2_4",src:"images/s1/Page2_00003.jpg"},
{id:"s1-2_5",src:"images/s1/Page2_00004.jpg"},
{id:"s1-2_6",src:"images/s1/Page2_00005.jpg"},
{id:"s1-2_7",src:"images/s1/Page2_00006.jpg"},
{id:"s1-2_8",src:"images/s1/Page2_00007.jpg"},
{id:"s1-2_9",src:"images/s1/Page2_00008.jpg"},
{id:"s1-2_10",src:"images/s1/Page2_00009.jpg"},*/


{id:"s1_1",src:"images/s1_1.gif"},//满瓶水
{id:"s1_2",src:"images/s1_2.gif"},//开盖
{id:"s1_2_2",src:"images/s1_2_2.gif"},//水动循环

//left倒水 
{id:"left_1",src:"images/Page3_Left/Page3_Left_00030.jpg"},
{id:"left_2",src:"images/Page3_Left/Page3_Left_00031.jpg"},
{id:"left_3",src:"images/Page3_Left/Page3_Left_00032.jpg"},
{id:"left_4",src:"images/Page3_Left/Page3_Left_00033.jpg"},
{id:"left_5",src:"images/Page3_Left/Page3_Left_00034.jpg"},
{id:"left_6",src:"images/Page3_Left/Page3_Left_00035.jpg"},
{id:"left_7",src:"images/Page3_Left/Page3_Left_00036.jpg"},
{id:"left_8",src:"images/Page3_Left/Page3_Left_00037.jpg"},
{id:"left_9",src:"images/Page3_Left/Page3_Left_00038.jpg"},
{id:"left_10",src:"images/Page3_Left/Page3_Left_00039.jpg"},
{id:"left_11",src:"images/Page3_Left/Page3_Left_00040.jpg"},
{id:"left_12",src:"images/Page3_Left/Page3_Left_00041.jpg"},
{id:"left_13",src:"images/Page3_Left/Page3_Left_00042.jpg"},
{id:"left_14",src:"images/Page3_Left/Page3_Left_00043.jpg"},
{id:"left_15",src:"images/Page3_Left/Page3_Left_00044.jpg"},
{id:"left_16",src:"images/Page3_Left/Page3_Left_00045.jpg"},
{id:"left_17",src:"images/Page3_Left/Page3_Left_00046.jpg"},
{id:"left_18",src:"images/Page3_Left/Page3_Left_00047.jpg"},
{id:"left_19",src:"images/Page3_Left/Page3_Left_00048.jpg"},
{id:"left_20",src:"images/Page3_Left/Page3_Left_00049.jpg"},
{id:"left_21",src:"images/Page3_Left/Page3_Left_00050.jpg"},
{id:"left_22",src:"images/Page3_Left/Page3_Left_00051.jpg"},
{id:"left_23",src:"images/Page3_Left/Page3_Left_00052.jpg"},
{id:"left_24",src:"images/Page3_Left/Page3_Left_00053.jpg"},
{id:"left_25",src:"images/Page3_Left/Page3_Left_00054.jpg"},
{id:"left_26",src:"images/Page3_Left/Page3_Left_00055.jpg"},
{id:"left_27",src:"images/Page3_Left/Page3_Left_00056.jpg"},
{id:"left_28",src:"images/Page3_Left/Page3_Left_00057.jpg"},
{id:"left_29",src:"images/Page3_Left/Page3_Left_00058.jpg"},
{id:"left_30",src:"images/Page3_Left/Page3_Left_00059.jpg"},

//right倒水 
{id:"right_1",src:"images/Page3_Right/Page3_Right_00030.jpg"},
{id:"right_2",src:"images/Page3_Right/Page3_Right_00031.jpg"},
{id:"right_3",src:"images/Page3_Right/Page3_Right_00032.jpg"},
{id:"right_4",src:"images/Page3_Right/Page3_Right_00033.jpg"},
{id:"right_5",src:"images/Page3_Right/Page3_Right_00034.jpg"},
{id:"right_6",src:"images/Page3_Right/Page3_Right_00035.jpg"},
{id:"right_7",src:"images/Page3_Right/Page3_Right_00036.jpg"},
{id:"right_8",src:"images/Page3_Right/Page3_Right_00037.jpg"},
{id:"right_9",src:"images/Page3_Right/Page3_Right_00038.jpg"},
{id:"right_10",src:"images/Page3_Right/Page3_Right_00039.jpg"},
{id:"right_11",src:"images/Page3_Right/Page3_Right_00040.jpg"},
{id:"right_12",src:"images/Page3_Right/Page3_Right_00041.jpg"},
{id:"right_13",src:"images/Page3_Right/Page3_Right_00042.jpg"},
{id:"right_14",src:"images/Page3_Right/Page3_Right_00043.jpg"},
{id:"right_15",src:"images/Page3_Right/Page3_Right_00044.jpg"},
{id:"right_16",src:"images/Page3_Right/Page3_Right_00045.jpg"},
{id:"right_17",src:"images/Page3_Right/Page3_Right_00046.jpg"},
{id:"right_18",src:"images/Page3_Right/Page3_Right_00047.jpg"},
{id:"right_19",src:"images/Page3_Right/Page3_Right_00048.jpg"},
{id:"right_20",src:"images/Page3_Right/Page3_Right_00049.jpg"},
{id:"right_21",src:"images/Page3_Right/Page3_Right_00050.jpg"},
{id:"right_22",src:"images/Page3_Right/Page3_Right_00051.jpg"},
{id:"right_23",src:"images/Page3_Right/Page3_Right_00052.jpg"},
{id:"right_24",src:"images/Page3_Right/Page3_Right_00053.jpg"},
{id:"right_25",src:"images/Page3_Right/Page3_Right_00054.jpg"},
{id:"right_26",src:"images/Page3_Right/Page3_Right_00055.jpg"},
{id:"right_27",src:"images/Page3_Right/Page3_Right_00056.jpg"},
{id:"right_28",src:"images/Page3_Right/Page3_Right_00057.jpg"},
{id:"right_29",src:"images/Page3_Right/Page3_Right_00058.jpg"},
{id:"right_30",src:"images/Page3_Right/Page3_Right_00059.jpg"},

//中间倒水 
{id:"center_1",src:"images/Page3_Center/Page3_Center_00030.jpg"},
{id:"center_2",src:"images/Page3_Center/Page3_Center_00031.jpg"},
{id:"center_3",src:"images/Page3_Center/Page3_Center_00032.jpg"},
{id:"center_4",src:"images/Page3_Center/Page3_Center_00033.jpg"},
{id:"center_5",src:"images/Page3_Center/Page3_Center_00034.jpg"},
{id:"center_6",src:"images/Page3_Center/Page3_Center_00035.jpg"},
{id:"center_7",src:"images/Page3_Center/Page3_Center_00036.jpg"},
{id:"center_8",src:"images/Page3_Center/Page3_Center_00037.jpg"},
{id:"center_9",src:"images/Page3_Center/Page3_Center_00038.jpg"},
{id:"center_10",src:"images/Page3_Center/Page3_Center_00039.jpg"},
{id:"center_11",src:"images/Page3_Center/Page3_Center_00040.jpg"},
{id:"center_12",src:"images/Page3_Center/Page3_Center_00041.jpg"},
{id:"center_13",src:"images/Page3_Center/Page3_Center_00042.jpg"},
{id:"center_14",src:"images/Page3_Center/Page3_Center_00043.jpg"},
{id:"center_15",src:"images/Page3_Center/Page3_Center_00044.jpg"},
{id:"center_16",src:"images/Page3_Center/Page3_Center_00045.jpg"},
{id:"center_17",src:"images/Page3_Center/Page3_Center_00046.jpg"},
{id:"center_18",src:"images/Page3_Center/Page3_Center_00047.jpg"},
{id:"center_19",src:"images/Page3_Center/Page3_Center_00048.jpg"},
{id:"center_20",src:"images/Page3_Center/Page3_Center_00049.jpg"},
{id:"center_21",src:"images/Page3_Center/Page3_Center_00050.jpg"},
{id:"center_22",src:"images/Page3_Center/Page3_Center_00051.jpg"},
{id:"center_23",src:"images/Page3_Center/Page3_Center_00052.jpg"},
{id:"center_24",src:"images/Page3_Center/Page3_Center_00053.jpg"},
{id:"center_25",src:"images/Page3_Center/Page3_Center_00054.jpg"},
{id:"center_26",src:"images/Page3_Center/Page3_Center_00055.jpg"},
{id:"center_27",src:"images/Page3_Center/Page3_Center_00056.jpg"},
{id:"center_28",src:"images/Page3_Center/Page3_Center_00057.jpg"},
{id:"center_29",src:"images/Page3_Center/Page3_Center_00058.jpg"},
{id:"center_30",src:"images/Page3_Center/Page3_Center_00059.jpg"}





]);
 }



var isloading = true;
function handleLoadStart(event) {
  document.getElementById("loading_text").innerHTML = Math.floor(queue.progress * 100) + "%";
  if (isloading) {    
    //_smq.push(['pageview','/loading','loading']); 
    isloading = false;
  };
}
function handleComplete() {
  s1_canvas();
 // _smq.push(['pageview','/intro','intro1']);
}

  
