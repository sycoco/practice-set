/**
 * Created by sy on 2017/7/10.
 */
// 获取地址栏中的参数，并把它转换为对象
define(function(){
    var search = window.location.search;
    var res = search.split('?')[1];
    var arr = res.split('&') || '';
    var obj = {};
    arr.forEach(function (item) {
        var key = item.split('=')[0];
        var value = item.split('=')[1];
        obj[key] = value;
    })
    return obj;
})