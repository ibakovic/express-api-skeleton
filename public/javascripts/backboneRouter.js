'use strict';

var $ = require('jquery');
var Backbone = require('backbone');

var Router = Backbone.Router.extend({
  routes: {
    '': 'loginPage',
    'login/:redirect': 'returnToLogin',
    'movies': 'startApp',
    'edit/:movieId': 'updateMovieTitle',
    'addMovie': 'addMovie'
  }
});

module.exports = Router;