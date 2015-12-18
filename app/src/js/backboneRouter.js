'use strict';

var $ = require('jquery');
var Backbone = require('backbone');

var Router = Backbone.Router.extend({
  routes: {
    '': 'loginPage',
    'register': 'openRegister',
    'confirm/:verId': 'confirmRegister',
    'login/:redirect': 'returnToLogin',
    'movies': 'startApp',
    'edit/:movieId': 'updateMovieTitle',
    'addMovie': 'addMovie',
    'userDetails/:userId': 'getUserDetails'
  }
});

var router = new Router();

module.exports = router;
