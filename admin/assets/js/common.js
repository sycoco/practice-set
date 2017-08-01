/**
 * Created by sy on 2017/7/8.
 */

define(['jquery', 'nprogress', 'cookie'], function ($, NProgress) {
    // 功能1:判断是否是登录状态
    isLogin();
    getInfo();
    slideToggle();
    signOut();
    sendProgress();

    function isLogin() {
        var sessionID = $.cookie('PHPSESSID')
        if (!sessionID) {
            //这个值不存在说明没有登录,页面跳回登录页面
            window.location.href = '/bxgSubject/bxg-template/views/index/login.html';
        }
    }

    //功能2:去Login页面中取cookie的值
    function getInfo() {
        var userInfo = JSON.parse($.cookie('userinfo'));
        // console.log(userInfo);
        $('.avatar img').attr('src', userInfo.tc_avatar);
        $('.profile h4').text(userInfo.tc_name);
    }

    //功能3:左侧列表收起和展开
    function slideToggle() {
        $('.navs li a').on('click', function () {
            $(this).next('ul').slideToggle();
        })
    }

    //功能4:退出登录
    function signOut() {
        $('.fa-sign-out').closest('li').on('click', clickHandle);
        function clickHandle() {
            console.log(1);
            $.ajax({
                url: '/api/logout',
                type: 'post',
                success: function (data) {
                    if (data.code == 200) {
                        window.location.href = '/views/index/login.html';
                    }
                }
            })
        }
    }

    //功能5:发送ajax请求时,有进度条显示
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