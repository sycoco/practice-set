/**
 * Created by sy on 2017/7/8.
 */
require.config({
    baseUrl:'/node_modules',
    paths:{
        jquery: './jquery/dist/jquery',
        cookie: './jquery.cookie/jquery.cookie',
        nprogress:'./nprogress/nprogress',
        template:'./art-template/lib/template-web',
        bootstrap:'./bootstrap/dist/js/bootstrap',
        datapicker:'./bootstrap-datepicker/dist/js/bootstrap-datepicker',
        zh:'./bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min',
        validate: './jquery-validation/dist/jquery.validate',
        form: './jquery-form/dist/jquery.form.min',
        webuploader:'./webuploader/dist/webuploader',
        jcrop:'/assets/jcrop/js/jquery.Jcrop'
    },
    shim:{
        bootstrap:{
            deps: ['jquery']
        },
        zh:{
            deps: ['jquery','datapicker']
        }
    }

})