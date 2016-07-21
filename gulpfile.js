var dotenv = require('dotenv').load();
var gulp = require('gulp');
var del = require('del');                             //删除
var minhtml = require("gulp-minify-html");                //压缩html                                      
var concat = require('gulp-concat');                      //多个文件合并为一个
var templateCache = require('gulp-angular-templatecache');//
var wrap = require("gulp-wrap");                          //
var minify = require('gulp-minify-css');                  //压缩css
var rename = require('gulp-rename');                      //
var nodemon = require('gulp-nodemon');                    //
var browserSync = require('browser-sync');                //
var autoprefixer = require('gulp-autoprefixer');          //
var plumber = require('gulp-plumber');                    //
var notify = require('gulp-notify');                      //提示信息
var less = require('gulp-less');                          //编译less
var replace=require("gulp-replace");                      //替换字符串
var zip = require('gulp-zip');                            //打包
var gulpSequence = require('gulp-sequence');              //
var files = {
  app: ['./app/index.module.js', './app/**/*.js'],  
  styles: ['./public/style/**/**.css'],
  html:['./app/**/*.html']
}

//gulp 默认任务
gulp.task('default', ['concat',"css"], function () {
  gulp.watch(files.app, ['concat']);    
  gulp.watch(files.styles,['css']);
})

//node本地服务
gulp.task('nodemon', function () {
  var called = false;
  nodemon({
    script: 'index.js',
    env: {'NODE_ENV': 'development'}
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
    .pipe(gulp.dest('public/'))    
      .pipe(notify({ message: 'js合并成功' }))
  //.pipe(browserSync.stream())
})
// 合并、压缩、重命名css
gulp.task('css', function() {
    return gulp.src(['./public/style/**/**.css'])
        .pipe(concat('style.css'))
        .pipe(gulp.dest('public/'))        
        .pipe(rename({ suffix: '.min' }))
        .pipe(minify())                
        .pipe(gulp.dest('public/'))
        .pipe(notify({ message: 'css压缩执行成功' }));
});

//Beep only for OSX
function beep() {
  var exec = require('child_process').exec;
  exec('afplay /System/Library/Sounds/Glass.aiff');
}
