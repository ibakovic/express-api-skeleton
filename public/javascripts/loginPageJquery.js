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
var AlertView = require('./alertView.js');
var RegisterView = require('./registerView.js');
var AlertView = require('./alertView.js');
var loginView;
var userView;
var moviesView;
var editView;
var addView;
var alertView;
var registerView;
var alertView;

Backbone.Events.on('loggedin', function() {});

Backbone.Events.on('movie:show:editView', function(model) {
  editView.getModel(model);
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

  router.on('route:loginPage', function() {
    moviesView.$el.hide();
    userView.$el.hide();
    addView.$el.hide();
    editView.$el.hide();
    registerView.$el.hide();

    loginView.render();
    loginView.$el.show();
  });

  router.on('route:openRegister', function() {
    console.log('Opened register route');
    moviesView.$el.hide();
    userView.$el.hide();
    addView.$el.hide();
    editView.$el.hide();
    loginView.$el.hide();

    registerView.render();
    registerView.$el.show();
  });

  router.on('route:startApp', function() {
    loginView.$el.hide();
    editView.$el.hide();
    addView.$el.hide();
    registerView.$el.hide();

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

  router.on('route:updateMovieTitle', function() {
    moviesView.$el.hide();
    userView.$el.hide();
    addView.$el.hide();
    loginView.$el.hide();
    registerView.$el.hide();

    editView.render();

    editView.$el.show();
  });

  router.on('route:addMovie', function() {
    moviesView.$el.hide();
    userView.$el.hide();
    loginView.$el.hide();
    editView.$el.hide();
    registerView.$el.hide();

    addView.render();

    addView.$el.show();
  });
  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});
