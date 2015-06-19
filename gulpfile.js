"use strict";

Object.assign = require('object.assign');

var connect = require('gulp-connect');
var gulp = require('gulp');
var gulpWebpack = require('gulp-webpack');
var path = require('path');
var postcss = require('postcss');
var gulpPostcss = require('gulp-postcss');
var postcssBem = require('postcss-bem');
var webpack = require('webpack');
var watch = require('gulp-watch');


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

var pokemonTypes = function(css) {
  var typeColours = [['normal', '#A8A878'],
    ['fire', '#F08030'],
    ['fighting', '#C03028'],
    ['water', '#6890F0'],
    ['flying', '#A890F0'],
    ['grass', '#78C850'],
    ['poison', '#A040A0'],
    ['electric', '#F8D030'],
    ['ground', '#E0C068'],
    ['psychic', '#F85888'],
    ['rock', '#B8A038'],
    ['ice', '#98D8D8'],
    ['bug', '#A8B820'],
    ['dragon', '#7038F8'],
    ['ghost', '#705898'],
    ['dark', '#705848'],
    ['steel', '#B8B8D0'],
    ['fairy', '#EE99AC']];

  css.eachAtRule('types', function(rule) {
    typeColours.forEach(function(primaryColour) {
      var atRule = postcss.atRule({name: "modifier", params: primaryColour[0]});
      var decl = postcss.decl({prop: 'background', value: primaryColour[1]});
      atRule.append(decl);
      rule.parent.append(atRule);

      typeColours.forEach(function(secondaryColour) {
        var atRule = postcss.atRule({name: "modifier", params: primaryColour[0] + '-' + secondaryColour[0]});
        var decl = postcss.decl({prop: 'background-image', value: 'linear-gradient(' + primaryColour[1] + ' 50%, ' + secondaryColour[1] + ' 50%, ' + secondaryColour[1] +')'});
        atRule.append(decl);
        rule.parent.append(atRule);
      });
    });
  });
}


gulp.task('build', function() {
  var compiler = gulpWebpack(webpackConfig, webpack);
  return gulp.src('./src/js/index.js')
    .pipe(compiler)
    .pipe(gulp.dest('./build'));
});

gulp.task('watch-js', function() {
  var compiler = gulpWebpack(Object.assign({}, {watch: true}, webpackConfig), webpack);
  return gulp.src('./src/js/index.js')
    .pipe(compiler)
    .pipe(gulp.dest('./build'));
});

gulp.task('css', function() {
  return gulp.src('./src/css/**/*.css')
    .pipe(gulpPostcss([pokemonTypes, postcssBem()]))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch-css', function() {
  gulp.src('./src/css/**/*.css')
    .pipe(watch('./src/css/**/*.css', {verbose: true}, function() {
      gulp.src('./src/css/**/*.css')
        .pipe(gulpPostcss([pokemonTypes, postcssBem()]))
        .pipe(gulp.dest('./build'));
    }))
});

gulp.task('server', function() {
  connect.server({
    root: 'build',
    port: '9989'
  });
});

gulp.task('develop', ['watch-js', 'watch-css', 'server']);