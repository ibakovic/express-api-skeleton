'use strict';

var $ = require('jquery');
var Backbone = require('backbone');

var Router = Backbone.Router.extend({
  routes: {
    '': 'allMovies',
    'loginPage': 'loginPage',
    'register': 'openRegister',
    'confirm/:verId': 'confirmRegister',
    'login': 'returnToLogin',
    'movies': 'startApp',
    'edit/:movieId': 'updateMovieTitle',
    'addMovie': 'addMovie',
    'userDetails/:userId': 'getUserDetails',
    'userInfo/:userId': 'userInfo'
  }
});

var router = new Router();

module.exports = router;
