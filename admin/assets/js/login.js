/**
 * Created by sy on 2017/7/7.
 */
define(['jquery','nprogress','cookie'], function ($,NProgress) {
    // 1.注册事件
    var $sub = $('#sub');
    $sub.on('click', clickHandler)
    function clickHandler (e) {
        e.preventDefault() // 禁用默认事件
        // 2.获取用户名和密码
        var user=$('#name').val();
        var pwd=$('#pass').val();
        if(!user.trim()||!pwd.trim()){
            alert('不能为空');
        }
        //3.发送请求
        $.ajax({
            url:'/api/login',
            type:'post',
            data:{
                tc_name:user,
                tc_pass:pwd
            },
            success:function (data) {
                // console.log(data);
                if(data.code===200){
                    // window.location.href='/bxgSubject/bxg-template/views/index/dashboard.html';
                    //把需要的数据存在cookie中,调用时再来取
                    $.cookie('userinfo',JSON.stringify(data.result),{expires:7,path:'/'})
                    window.location.href='/views/index/dashboard.html'
                }
            }
        })
    }
    sendProgress();
    function sendProgress() {
        $(document).ajaxStart(function () {
            NProgress.start();
        })
        $(document).ajaxStop(function () {
            NProgress.done();
        })
    }

    $(function () {
        NProgress.done()
    })
})