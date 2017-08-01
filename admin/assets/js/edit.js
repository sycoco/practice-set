/**
 * Created by sy on 2017/7/10.
 */
require(['/assets/js/config.js'],function () {
    require(['jquery','/assets/js/getarg.js','validate','datapicker','form','/assets/js/common.js','zh'],function ($,obj) {
        //请求数据
        var tcid = obj.tc_id;
        // console.log(tcid);
        $.ajax({
            url:'/api/teacher/edit',
            type:'get',
            data:{
                tc_id:tcid
            },
            success:function (data) {
                if(data.code === 200){
                    console.log(data);
                    //显示数据
                    var $tcName = $('input[name="tc_name"]');
                    var $tcJoindate = $('input[name="tc_join_date"]');
                    var $tcType = $('input[name="tc_type"]');
                    var $tcGenter = $('input[name="tc_genter"]');
                    var obj = data.result;
                    $tcName.val(obj.tc_name);
                    $tcJoindate.val(obj.tc_join_date);
                    $tcType.val(obj.tc_type);
                    $tcGenter.val(obj.tc_gender);

                }
            }
        })
        //表单验证
        $('form').validate({
            submitHandler: function () {
                // 验证通过会执行这个方法
                // 这里调用发ajax请求的方法
                $('form').ajaxSubmit({
                    url: '/api/teacher/update',
                    type: 'post',
                    data:{
                        //追加到表单中与其他参数一起发给后端
                        tc_id:tcid
                    },
                    success: function (data) {
                        if (data.code === 200) {
                            window.alert('添加成功！')
                        }
                    }
                })
            },
            rules: {
                tc_name: {
                    required: true,
                    rangelength: [2, 4]
                },
                tc_join_date: {
                    required: true,
                    date: true
                }
            },
            messages: {
                tc_name: {
                    required: '不能为空',
                    rangelength: '长度要在2到4之间'
                }
            }
        })
        //日期插件
        $('#jointime').datepicker({
            fromat:'yyyy/mm/dd',
            language: 'zh-CN'
        })
    })
})