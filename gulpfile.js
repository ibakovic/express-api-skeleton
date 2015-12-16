'use strict';

var browserify = require('gulp-browserify');
var browserifyHandlebars = require('browserify-handlebars');
var gulp = require("gulp");
var eslint = require("gulp-eslint");
var nodemon = require("gulp-nodemon");
var shell = require("gulp-shell");
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var path = require('path');

var istanbul = require('gulp-istanbul');
// We'll use mocha here, but any test framework will work
var mocha = require('gulp-mocha');

var paths = {
  //routes: ['./test/**/*.js', './routes/*.js', './controllers/**/*.js'],
  src: ['./models/*.js', './test/*.js', './controllers/**/*.js', './index.js'],
  lint: {
    routes: ['./controllers/**/*.js'],
    test: ['./test/*.js']
  }
};

gulp.task('browserify', function() {
  // Single entry point to browserify
  gulp.src('./app/src/js/main.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production,
      transform: [browserifyHandlebars],
      paths: [ './app/src/js' ]
    }))
    .pipe(gulp.dest('./app/dist'));
});

gulp.task('less', function () {
  return gulp.src('./app/src/style/mainStyle.less')
    .pipe(less({
      paths: [ './app/src/style' ]
    }))
    .pipe(gulp.dest('./app/dist'));
});

gulp.task('lint', function() {
  return gulp.src(paths.lint.routes)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('server', function() {
  nodemon({
    script: './bin/www'
  });
});

gulp.task('server-debug', function() {
  nodemon({
    script: './bin/www',
    nodeArgs: ['--debug']
  });
});

gulp.task('debug', ['server-debug'],
  shell.task('node-inspector --web-port=3465'));

gulp.task('default', ['server', 'lint']);
