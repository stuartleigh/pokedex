"use strict";

Object.assign = require('object.assign');

var connect = require('gulp-connect');
var gulp = require('gulp');
var gulpWebpack = require('gulp-webpack');
var path = require('path');
var webpack = require('webpack');


var PRODUCTION = (process.env.NODE_ENV === 'production');


var webpackConfig = {
  cache: true,
  debug: !PRODUCTION,
  devtool: PRODUCTION ? 'source-map' : 'eval-source-map',
  context: __dirname,
  output: {
    path: path.resolve('./build/'),
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx|.js$/,
        exclude: /node_modules\//,
        loaders: [
          'babel-loader?stage=1'
        ]
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};


gulp.task('build', function() {
  var compiler = gulpWebpack(webpackConfig, webpack);
  return gulp.src('./src/js/index.js')
    .pipe(compiler)
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
  var compiler = gulpWebpack(Object.assign({}, {watch: true}, webpackConfig), webpack);
  return gulp.src('./src/js/index.js')
    .pipe(compiler)
    .pipe(gulp.dest('./build'));
});

gulp.task('server', function() {
  connect.server({
    root: 'build',
    port: '9989'
  });
});

gulp.task('develop', ['build', 'watch', 'server']);