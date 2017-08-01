/**
 * Created by sy on 2017/7/9.
 */

require(['/assets/js/config.js'],function () {

    require(['jquery','template','bootstrap','/assets/js/common.js'],function ($,template) {
        getTeaList();
        getBirth();
        getdetailInfo();
        startOrstop();
    //功能1:获取教师信息并展示
        function getTeaList() {
            $.ajax({
                type:'get',
                url:'/api/teacher',
                success:function (data) {
                    if(data.code==200){
                        var res = template('tmpl-list',{list:data.result});
                        $('#list').html(res);
                    }
                }
            })
        }
    //功能2:设置年龄
        function getBirth(birth) {
            var birthYear = new Date(birth).getFullYear();
            var nowYear = new Date().getFullYear();
            return nowYear-birthYear;
        }
        //把js的方法赋值给模板引擎,这样模板引擎就可以用这个方法
        template.defaults.imports.getTecAge=getBirth;
    //功能3:点击查看功能
        function getdetailInfo() {
            $('#list').on('click','.preview',function () {
                var tcid = $(this).closest('tr').attr('tc-id');
                $.ajax({
                    type:'get',
                    data:{
                        tc_id:tcid
                    },
                    url:'/api/teacher/view',
                    success:function (data) {
                        console.log(data.result)
                        if(data.code==200){
                            var result = template('detail-list',{item:data.result});
                            $('#modal-list').html(result);
                        }

                    }
                })
            })
        }
    //功能4:注销和启用
        function startOrstop() {
            $('#list').on('click','.start-stop',function () {
                var $this = $(this);
                var $tr = $this.closest('tr');
                var tcId = $tr.attr('tc-id') // 讲师id : 29
                var tcStatus = $tr.attr('tc-status') // 状态: 0
                $.ajax({
                    type:'post',
                    url:'/api/teacher/handle',
                    data:{
                        tc_id:tcId,
                        tc_status:tcStatus
                    },
                    success:function (data) {
                        // 0 是启用状态， 1 是注销状态
                        // 请求成功之后，要把原来是注销改为启用
                        // 原来是启用，改为注销
                        // data.result.tc_status 就是后端修改后讲师的状态，根据这个状态来显示是什么字
                        var str = data.result.tc_status === 0 ? '注销':'启用';
                        $tr.attr('tc-status',data.result.tc_status);
                        $this.text(str);
                    }
                })
            })
        }
    })
})

