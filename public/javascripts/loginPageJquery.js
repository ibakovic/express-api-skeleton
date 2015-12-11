var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var addMovieTemplate = require('../../templates/addMovieTemplate.handlebars');
var moviesTemplate = require('../../templates/moviesTemplate.handlebars');
var editTemplate = require('../../templates/editTemplate.handlebars');
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
var loginView;
var userView;
var moviesView;
var editView;
var addView;
var alertView;
var registerView;
var promptView;
var userDetailsView;

Backbone.Events.on('prompt', function(message, title) {
  promptView.getMessage(message, title);
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

  var LoginModel = Backbone.Model.extend({
    url: '/login'
  });

  var RegisterModel = Backbone.Model.extend({
    url: '/register'
  });

  var MovieModel = Backbone.Model.extend({
    urlRoot: '/movies',
    id: ''
  });

  var MovieCollection = Backbone.Collection.extend({
    model: MovieModel,
    url: '/movies',

    parse: function(response) {
      return response.data;
    }
  });

  var Movies = new MovieCollection();

  var UserModel = Backbone.Model.extend({
    url: '/',
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

  registerView = new RegisterView({
    el: $('#registerForm'),
    model: RegisterModel
  });
  registerView.$el.hide();

  loginView = new LoginView({
    el: $('#loginWrapper'),
    model: LoginModel,
  });
  loginView.$el.hide();

  moviesView = new MovieView({
    el: $('#mainContainer'),
    cookieId: currentUserId[1],
    collection: Movies
  });

  userView = new UserView({
    el: $('#userInfo'),
    cookieId: currentUserId[1],
    model: User
  });

  addView = new AddView({
    el: $('#addMovieForm'),
    movieModel: MovieModel,
    userId: currentUserId[1]
  });
  addView.$el.hide();

  editView = new EditView({
    el: $('#editForm'),
    cookieId: currentUserId[1],
    collection: Movies
  });

  userDetailsView = new UserDetailsView({
    el: $('#userDetailsForm'),
    model: User
  });

  router.on('route:loginPage', function() {
    moviesView.$el.hide();
    userView.$el.hide();
    addView.$el.hide();
    editView.$el.hide();
    registerView.$el.hide();
    userDetailsView.$el.hide();

    loginView.render();
    loginView.$el.show();
  });

  router.on('route:openRegister', function() {
    moviesView.$el.hide();
    userView.$el.hide();
    addView.$el.hide();
    editView.$el.hide();
    loginView.$el.hide();
    userDetailsView.$el.hide();

    registerView.render();
    registerView.$el.show();
  });

  router.on('route:startApp', function() {
    loginView.$el.hide();
    editView.$el.hide();
    addView.$el.hide();
    registerView.$el.hide();
    userDetailsView.$el.hide();

    Movies.fetch({success: function(collection, response) {
      moviesView.render();
      moviesView.$el.show();
    }});

    User.fetch({success: function(collection, response) {
      userView.render();
      userView.$el.show();
    }});
  });

  router.on('route:returnToLogin', function(redirect) {
    document.location = redirect;
  });

  router.on('route:updateMovieTitle', function(movieId) {
    moviesView.$el.hide();
    userView.$el.hide();
    addView.$el.hide();
    loginView.$el.hide();
    registerView.$el.hide();
    userDetailsView.$el.hide();

    if(Movies.length === 0) {
      Movies.fetch({success: function(collection, response) {
        editView.getMovieId(movieId);
        editView.render();
        editView.$el.show();
        return;
      }});
    }

    editView.getMovieId(movieId);
    editView.render();
    editView.$el.show();
  });

  router.on('route:addMovie', function() {
    moviesView.$el.hide();
    userView.$el.hide();
    loginView.$el.hide();
    editView.$el.hide();
    registerView.$el.hide();
    userDetailsView.$el.hide();

    addView.render();
    addView.$el.show();
  });

  router.on('route:getUserDetails', function(userId) {
    moviesView.$el.hide();
    userView.$el.hide();
    loginView.$el.hide();
    editView.$el.hide();
    registerView.$el.hide();
    addView.$el.hide();

    if(!User.get('username')) {
      User.fetch({success: function(model, response) {
        userDetailsView.render();
        userDetailsView.$el.show();
        return;
      }});
    }

    userDetailsView.render();
    userDetailsView.$el.show();
  });

  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});
