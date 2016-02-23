'use strict';

var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    babel           = require("gulp-babel"),
    browserify      = require('gulp-browserify'),
    cssnano         = require('gulp-cssnano'),
    imagemin        = require('gulp-imagemin'),
    jade            = require('gulp-jade'),
    jshint          = require('gulp-jshint'),
    sass            = require('gulp-sass'),
    stylish         = require('jshint-stylish'),
    uglify          = require('gulp-uglify');

const SRC = './src';
const DIST = './dist';

gulp.task('scripts',() => {
  return gulp.src([SRC+'/js/*.js', '!./node_modules/**', '!./dist/**'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(babel())
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(uglify())
    .pipe(gulp.dest(DIST+'/src/js'));
});

gulp.task('templates', function() {
  var LOCALS = {};
  gulp.src(['**/*.jade', '!./node_modules/**', '!./dist/**', '!./includes/**'])
    .pipe(jade({
      locals: LOCALS
    }))
    .pipe(gulp.dest(DIST));
});

gulp.task('images', () => {
  return gulp.src([SRC+'/img/**/*', '!./node_modules/**', '!./dist/**'])
    .pipe(imagemin({
      optimizationLevel: 2,
      progressive: true,
      svgoPlugins: [
        {removeViewBox: false},
        {cleanupIDs: false}
      ]}))
    .pipe(gulp.dest(DIST+'/src/img'));
});

gulp.task('sass', () => {
  return gulp.src([SRC+'/scss/**/*.scss', '!./node_modules/**', '!./dist/**'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['>1%'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest(DIST+'/src/css'));
});

gulp.task('watch',['default'], () => {
  gulp.watch(['**/*.jade'], ['templates']);
  gulp.watch(SRC+'/scss/**/*.scss', ['sass']);
  gulp.watch(SRC+'/js/**/*.js', ['scripts']);
  gulp.watch(SRC+'/img/**/*', ['images']);
});

gulp.task('default', ['sass','scripts','images','templates']);
