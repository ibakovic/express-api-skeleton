'use strict';

var $ = require('jquery');
var Backbone = require('backbone');

var Router = Backbone.Router.extend({
  routes: {
    '': 'loginPage',
    'register': 'openRegister',
    'login/:redirect': 'returnToLogin',
    'movies': 'startApp',
    'edit': 'updateMovieTitle',
    'addMovie': 'addMovie'
  }
});

var router = new Router();

module.exports = router;
