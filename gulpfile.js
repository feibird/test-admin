var dotenv = require('dotenv').load();
var gulp = require('gulp');
var del = require('del');                                             //删除
var minhtml = require("gulp-minify-html");                            //压缩html                                      
var concat = require('gulp-concat');                                  //多个文件合并为一个
var templateCache = require('gulp-angular-templatecache');            //
var wrap = require("gulp-wrap");                                      //
var minify = require('gulp-minify-css');                              //压缩css
var minjs = require('gulp-uglify');                                   //压缩js
var rename = require('gulp-rename');                                  //重命名
var nodemon = require('gulp-nodemon');                                //node本地服务
var notify = require('gulp-notify');                                  //提示信息
var less = require('gulp-less');                                      //编译less
var replace = require("gulp-replace");                                //替换字符串
var zip = require('gulp-zip');                                        //打包
var gulpSequence = require('gulp-sequence');                          //控制tasl顺序

var files = {
  app: ['./app/index.module.js', './app/**/*.js'],
  styles: ['./public/style/**/**.css'],
  html: ['./app/**/*.html']
}

//gulp 默认任务
gulp.task('default', ['concat', "css"], function () {
  gulp.watch(files.app, ['concat']);
  gulp.watch(files.styles, ['css']);
})

//node本地服务
gulp.task('nodemon', function () {
  var called = false;
  nodemon({
    script: 'index.js',
    env: { 'NODE_ENV': 'development' }
  })
    .on('crash', function () {
      beep();
      browserSync.exit();
    })
})

//angularJs控制器合并
gulp.task('concat', function () {
  return gulp.src(files.app)
    .pipe(wrap('(function(){\n"use strict"\n<%= contents %>\n})();'))
    .pipe(concat('app.js'))
    // .pipe(replace(/console.log(.+)/g,""))
    .pipe(gulp.dest('public/'))
    .pipe(gulp.dest('dist/'))
})

// 合并、压缩、重命名css
gulp.task('css', function () {
  return gulp.src(['./public/style/**/**.css'])
    .pipe(concat('style.css'))
    .pipe(gulp.dest('public/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify())
    .pipe(gulp.dest('public/'))
    .pipe(gulp.dest('dist/'))
});

gulp.task('frame', function () {
  return gulp.src('./dist/public/css/*.css')
    .pipe(concat('frame.css'))
    .pipe(gulp.dest('./dist/public/css/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify())
    .pipe(gulp.dest('./dist/public/css/'))
})

//html压缩
gulp.task('min-html', function () {
  return gulp.src('app/**/**.html')  //要压缩的html文件
    .pipe(minhtml())//压缩
    .pipe(gulp.dest('dist'))
})

//拷贝
gulp.task("copy", function () {
  return gulp.src(['**/public/**/*.*', '!**/node_modules/**/*.*'])
    .pipe(gulp.dest('dist'))
});


//替换文件地址
gulp.task('updateUrl', function () {
  return gulp.src('dist/index.html')
    .pipe(replace('../public/', 'public/'))
    // .pipe(replace('/libs/angular.js','/min/angular.min.js'))
    .pipe(replace('public/libs/angular.js', 'public/min/angular.js'))
    .pipe(replace('public/style.css', 'style.min.css'))
    .pipe(replace('/libs/angular-ui-router.js', '/min/angular-ui-router.min.js'))
    .pipe(replace('/libs/angular-local-storage.js', '/min/angular-local-storage.min.js'))
    .pipe(replace('public/app.js', 'app.js'))    
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: '路径替换成功' }));
})

//打包测试
gulp.task("zip", function () {
  return gulp.src("dist/**/*.*")
    .pipe(zip('web-admin.zip'))
    .pipe(gulp.dest('zip'))
})

//删除调试信息


//删除
gulp.task('del', function () {
 return del([
    "**/dist/public/less",
    "**/dist/public/libs",
    "**/dist/public/style",
    "**/dist/public/images",
    "**/dist/public/app.js",
    "**/dist/public/style.min.css",
    "**/dist/public/style.css"
  ]);
})

//删除
gulp.task('del-dist', function () {
  return del([
    "zip/",
    "dist/",
  ]);
})

/**
 * 测试打包任务
 * min-html：压缩html文件
 * cory    : 拷贝文件
 * del     ：删除文件
 * updateUrl:修改路径地址
 * Urltest ：修改index.js引用
 * zip     ：
 */
gulp.task("test", gulpSequence('del-dist',['concat', 'css', 'min-html', 'copy'], ['updateUrl', 'del'],'zip'))
//Beep only for OSX
function beep() {
  var exec = require('child_process').exec;
  exec('afplay /System/Library/Sounds/Glass.aiff');
}
