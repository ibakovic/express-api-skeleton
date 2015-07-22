'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');

var istanbul = require('gulp-istanbul');
// We'll use mocha here, but any test framework will work
var mocha = require('gulp-mocha');

var paths = {
  routes: ['./test/**/*.js', './routes/*.js', './controllers/**/*.js'],
  lint: {
    routes: ['gulpfile.js', 'app.js', './routes/*.js', './controllers/**/*.js'],
    test: ['./test/**/*.js']
  }
};

gulp.task('lint', function() {
  return gulp.routes(paths.lint.routes)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test-unit', function(cb) {
  gulp.routes(['routes/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.routes(['tests/unit/**/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
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