var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var LoginView = require('./loginView.js');
var MovieView = require('./movieCollectionView.js');
var UserView = require('./userView.js');
var EditView = require('./editView.js');
var AddView = require('./addView.js');
var RegisterView = require('./registerView.js');
var AlertView = require('./alertView.js');
var PromptView = require('./promptView.js');
var UserDetailsView = require('./userDetailsView.js');
var ConfirmView = require('./confirmView.js');
var UserInfoView = require('./userInfoView.js');
var loginView;
var userView;
var moviesView;
var editView;
var addView;
var alertView;
var registerView;
var promptView;
var userDetailsView;
var confirmView;
var userInfoView;

Backbone.Events.on('prompt', function(message, title, id) {
  promptView.getMessage(message, title, id);
  promptView.render();
  promptView.$el.show();
});

Backbone.Events.on('alert', function(message, title) {
  alertView.getMessage(message, title);
  alertView.render();
  alertView.$el.show();
});

Backbone.Events.on('movie:add', function(model) {
  moviesView.appendItem(model);
});

$('document').ready(function() {
  var currentUserId = document.cookie.split('=');

  var MovieModel = Backbone.Model.extend({
    urlRoot: '/users/movies'
  });

  var MovieCollection = Backbone.Collection.extend({
    model: MovieModel,
    url: '/users/movies',

    parse: function(response) {
      return response.data;
    }
  });

  var Movies = new MovieCollection();

  var UserModel = Backbone.Model.extend({
    url: '/users',
    parse: function(response) {
      return response.data;
    }
  });

  var User = new UserModel();

  promptView = new PromptView({
    el: $('#promptForm'),
    content: $('#promptBox')
  });

  alertView = new AlertView({
    el: $('#alertForm'),
    content: $('#alertBox')
  });

  registerView = new RegisterView();
  registerView.render();
  $('body').append(registerView.$el);
  registerView.hide();

  loginView = new LoginView();
  loginView.render();
  $('body').append(loginView.$el);
  loginView.hide();

  moviesView = new MovieView({
    el: $('#mainContainer'),
    cookieId: currentUserId[1],
    collection: Movies
  });

  userView = new UserView({
    cookieId: currentUserId[1],
    model: User
  });
  userView.render();
  $('body').append(userView.$el);
  userView.hide();

  addView = new AddView({
    movieModel: MovieModel,
    userId: currentUserId[1]
  });
  addView.render();
  $('body').append(addView.$el);
  addView.hide();

  editView = new EditView({
    cookieId: currentUserId[1],
    collection: Movies
  });
  editView.render();
  $('body').append(editView.$el);
  editView.hide();

  userDetailsView = new UserDetailsView({
    el: $('#userDetailsForm'),
    model: User
  });

  confirmView = new ConfirmView();
  confirmView.render();
  $('body').append(confirmView.$el);
  confirmView.hide();

  userInfoView = new UserInfoView({
    model: User
  });

  /////////////////////////////Rerouting

  router.on('route:loginPage', function() {
    moviesView.$el.hide();
    userView.hide();
    addView.hide();
    editView.hide();
    registerView.hide();
    userDetailsView.$el.hide();
    alertView.$el.hide();
    confirmView.hide();
    userInfoView.hide();

    loginView.show();
  });

  router.on('route:openRegister', function() {
    moviesView.$el.hide();
    userView.hide();
    addView.hide();
    editView.hide();
    loginView.hide();
    userDetailsView.$el.hide();
    alertView.$el.hide();
    confirmView.hide();
    userInfoView.hide();

    registerView.show();
  });

  router.on('route:confirmRegister', function(verId) {
    moviesView.$el.hide();
    userView.hide();
    addView.hide();
    editView.hide();
    loginView.hide();
    userDetailsView.$el.hide();
    alertView.$el.hide();
    registerView.hide();
    userInfoView.hide();

    confirmView.getVerId(verId);
    confirmView.render();
    confirmView.show();
  });

  router.on('route:startApp', function() {
    loginView.hide();
    editView.hide();
    addView.hide();
    registerView.hide();
    userDetailsView.$el.hide();
    alertView.$el.hide();
    confirmView.hide();
    userInfoView.hide();

    Movies.fetch({success: function(collection, response) {
      moviesView.render();
      moviesView.$el.show();
      User.fetch({success: function(collection, response) {
        userView.show();
      }});
    }});

  });

  router.on('route:returnToLogin', function(redirect) {
    document.location = redirect;
  });

  router.on('route:updateMovieTitle', function(movieId) {
    moviesView.$el.hide();
    addView.hide();
    loginView.hide();
    registerView.hide();
    userDetailsView.$el.hide();
    alertView.$el.hide();
    confirmView.hide();
    userInfoView.hide();

    if(Movies.length === 0) {
      Movies.fetch({success: function(collection, response) {
        userView.show();
        editView.getMovieId(movieId);
        editView.show();
        return;
      }});
    }

    editView.getMovieId(movieId);
    editView.show();
  });

  router.on('route:addMovie', function(imageId) {
    moviesView.$el.hide();
    loginView.hide();
    editView.hide();
    registerView.hide();
    userDetailsView.$el.hide();
    alertView.$el.hide();
    confirmView.hide();
    userInfoView.hide();

    addView.getImgId(imageId);
    userView.show();
    addView.show();
  });

  router.on('route:getUserDetails', function(userId) {
    moviesView.$el.hide();
    loginView.hide();
    editView.hide();
    registerView.hide();
    addView.hide();
    alertView.$el.hide();
    confirmView.hide();
    userInfoView.hide();

    if(!User.get('username')) {
      User.fetch({success: function(model, response) {
        userView.show();
        userDetailsView.render();
        userDetailsView.$el.show();
        return;
      }});
    }

    userDetailsView.render();
    userDetailsView.$el.show();
  });

  router.on('route:userInfo', function(userId) {
    moviesView.$el.hide();
    loginView.hide();
    editView.hide();
    registerView.hide();
    addView.hide();
    alertView.$el.hide();
    confirmView.hide();
    userDetailsView.$el.hide();

    if(!User.get('username')) {
      User.fetch({success: function(model, response) {
        userView.show();
        userInfoView.render();
        $('body').append(userInfoView.$el);
        userInfoView.show();
        return;
      }});
    }

    userView.show();
    userInfoView.show();
  });

  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});
