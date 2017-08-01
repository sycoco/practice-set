/**
 * Created by sy on 2017/7/13.
 */
require( ['/assets/js/config.js', '/assets/js/config.js'],function () {
    require( ['jquery', '/assets/js/getarg.js','template','validate', 'form'],
        function ($,args,template) {
        //获取课程信息
        getCourseinfo();
        function getCourseinfo() {
            $.ajax({
                url: '/api/course/basic',
                data: {
                    cs_id: args.cs_id
                },
                success: function (data) {
                    var result = template('teml',{res:data.result});
                    $('.content').html(result);
                    //二级联动
                    $('#top').on('change',function () {
                        var cgId = $(this).val();
                        $.ajax({
                            url: '/api/category/child',
                            type: 'post',
                            data: {
                                cg_id: cgId
                            },
                            success: function (data) {
                                var str = '';
                                data.result.forEach(function(item){
                                    str += '<option value="'+item.cg_id+'">'+item.cg_name+'</option>';
                                })
                                $('#childs').html(str);
                                formTest();//验证表单
                            }
                        })
                    })

                }
            })
        }
        //表单验证
        function formTest() {
            $('form').validate({
                submitHandler: function () {
                    var options = {
                        url: '/api/course/update/basic',
                        type: 'post',
                        data: {
                            cs_id: args.cs_id
                        },
                        success: function (data) {
                            location.href = './step2.html?cs_id=' + data.result.cs_id;
                            console.log(data);
                        }
                    }
                    $('form').ajaxSubmit(options);
                },
                rules: {
                    cs_name:{
                        required: true,
                        rangelength: [3, 8]
                    },
                    cs_tags: {
                        required: true,
                        rangelength: [2, 50]
                    }
                },
                messages: {
                    cs_name:{
                        required: '不能为空啊',
                        rangelength: '长度在3-8之间啊'
                    },
                    cs_tags: {
                        required: '亲，不能为空',
                        rangelength: '2，50'
                    }
                }
            })
        }

    })
})