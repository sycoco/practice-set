/**
 * Created by sy on 2017/7/13.
 */
require( ['/assets/js/config.js', '/assets/js/config.js'],function () {
    require( ['jquery', 'validate', 'form'],function ($) {
        //提交数据并且获取服务器返还数据,跳转页面
        $('form').validate({
            submitHandler: function () {
                var options = {
                    url: '/api/course/create',
                    type: 'post',
                    success: function (data) {

                        location.href = './step1.html?cs_id=' + data.result.cs_id;
                        console.log(data);
                    }
                }
                $('form').ajaxSubmit(options)
            },
            rules: {
                cs_name:{
                    required: true,
                    rangelength: [3, 8]
                }
            },
            messages:{
                cs_name:{
                    required: '不能为空啊',
                    rangelength: '长度在3-8之间啊'
                }
            }
        })
    })
})