var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Router = require('./backboneRouter.js');
var LoginView = require('./loginView.js');
var MovieView = require('./movieView.js');
var UserView = require('./userView.js');
var loginView;
var usersView;
var moviesView;

$('document').ready(function() {
  var currentUserId;
  var router = new Router();
  router.on('route:loginPage', function() {
    loginView = new LoginView({el: $('#loginWrapper')});
  });

  router.on('route:startApp', function() {
    currentUserId = document.cookie.split('=');
    console.log('Main js file', currentUserId[1]);
    usersView = new UserView({
      el: $('#userInfo'),
      cookieId: currentUserId[1]
    });
    moviesView = new MovieView({
      el: $('#mainContainer'),
      cookieId: currentUserId[1]
    });

    usersView.$el.show();
    moviesView.$el.show();

    loginView = new LoginView({el: $('#loginWrapper')});
    loginView.$el.hide();
  });

  router.on('route:returnToLogin', function(redirect) {
    document.location = redirect;
  });
  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});
