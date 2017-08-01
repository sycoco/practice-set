/**
 * Created by sy on 2017/7/13.
 */
/**
 * Created by sy on 2017/7/13.
 */
require(['/assets/js/config.js','/assets/js/common.js'],function () {
    require(['jquery','/assets/js/getarg.js','webuploader','jcrop'],function ($,args,webuploader) {
        //上传图片
        var coords = {};//用来保存切片坐标
        upLoaderImg();
        function upLoaderImg() {
            var uploader = webuploader.create({
                // 选完文件后，是否自动上传。
                auto: true,
                // swf文件路径
                // swf: BASE_URL + '/js/Uploader.swf',
                swf: '/node_modules/webuploader/dist/Uploader.swf',
                // 文件接收服务端。
                // server: 'http://webuploader.duapp.com/server/fileupload.php',
                // server: 'http://api.botue.com/uploader/avatar',
                server: '/api/uploader/cover',
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '#filePicker',
                formData: {
                    cs_id: args.cs_id
                },
                // pick: '#upload',
                fileVal: 'cs_cover_original', // 参数名
                // 只允许选择图片文件。
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png'
                    // mimeTypes: 'image/*'
                }
            });
            uploader.on('uploadSuccess',function (xx,data) {
                $('.preview img').attr('src',data.result.path)
                    .on('load',function () {
                        jcropImg();
                    })

            })
        }
        //裁剪图片
        function jcropImg() {
            var options = {
                aspectRatio: 1.618,
                allowSelect: true,
                baseClass: 'jcrop',
                boxWidth: 300,  // 设置图片的宽度
                aspectRatio: 1.618, // 长宽的比例 //  长/宽
                onSelect: function (c) {
                    coords = c;
                    console.log(coords);
                }
            }
            $('.preview img').Jcrop(options,function () {
                this.setSelect([0, 20, 100, 400]);//在(0,20)的坐标创建一个100*400的截图区域
            })
        }
        //点击按钮向服务器发送数据,裁剪图片
        shortImg();
        function shortImg() {
            $('#shortImg').on('click',function () {
                coords.cs_id = args.cs_id;
                $.ajax({
                    type:'post',
                    url: '/api/course/update/picture',
                    data: coords,
                    success: function (data) {
                        if(data.code == 200){
                            location.href = './step3.html?cs_id='+args.cs_id;
                        }
                    }
                })
            })
        }
    })
})