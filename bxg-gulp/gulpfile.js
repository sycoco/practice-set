/**
 * Created by sy on 2017/7/14.
 */
var gulp = require('gulp');
var browserSync = require('browser-sync');
var proxy = require('http-proxy-middleware');//反向代理的包
var minifyCss = require('gulp-minify-css');//压缩css
var autoprefixer = require('gulp-autoprefixer')//添加前缀
var uglify = require('gulp-uglify')//压缩js
var babel = require('gulp-babel')//把es6语法转为es5
var htmlmin = require('gulp-htmlmin')//压缩html
var apiProxy = proxy('/api', {
    target: 'http://api.botue.com/v1', // /api 请求代理到这个地址
    changeOrigin: true,
    // 重写路径
    // /api/login   /login   http://api.boute.com/v1/login
    pathRewrite: {
        // 转换后的路径与target拼接
        '^/api/*': '/'
    }
})//api表示只有请求地址以api开头,proxy才会反向代理

gulp.task('server',function () {
    var options = {
        server: './bxg-template',
        files: ['./bxg-template/**/*'],//监测/bxg-template文件下所有文件,变化就自动刷新
        middleware:[apiProxy]
    }
    browserSync.init(options);//配置服务器的
})

gulp.task('css',function () {
    //处理匹配到的文件,并且保存起来
    gulp.src(['./bxg-template/assets/css/*.css'])
        .pipe(minifyCss())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('./dist/assets/css'))
})

//处理js
gulp.task('js',function () {
    //匹配文件,并且保存
    gulp.src(['./bxg-template/assets/js/*.js'])
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())// 这个插件只能压缩es5代码
        .pipe(gulp.dest('./dist/assets/js'))
})

//处理HTML
gulp.task('html',function () {
    var options = {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input checked/>
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面中的JS
        minifyCSS: true // 压缩页面中的CSS
    }
    gulp.src(['./bxg-template/views/**/*.html'])
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/views'))
})

//复制一遍node_modules
gulp.task('copyFile',function () {
    gulp.src(['./bxg-template/node_modules/**/*.js'])
        .pipe(gulp.dest('./dist/node_modules'))
})

//同时执行多个任务
gulp.task('watch', function () {
    // 数组1：要监视的文件
    // 数组2: 是要执行的任务
    gulp.watch(['./bxg/assets/js/**/*.js'], ['js'])
    gulp.watch(['./bxg/assets/css/*.css'], ['css'])
    gulp.watch(['./bxg/views/**/*.html'], ['html'])
})
gulp.task('release', function () {
    // copyFile
    gulp.start(['js', 'css', 'html', 'watch'])
})
//  我希望一次性把多个任务一起执行
gulp.task('default', ['release'], function () {
    gulp.start(['server'])
    // 用代码调用其他所有的任务
    // start方法，是用来指靠指定的任务
    // gulp.start(, function () {
    // })
})


