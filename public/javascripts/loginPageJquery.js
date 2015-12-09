var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var addMovieTemplate = require('../../templates/addMovieTemplate.handlebars');
var moviesTemplate = require('../../templates/moviesTemplate.handlebars');
var editTemplate = require('../../templates/editTemplate.handlebars');
var Router = require('./backboneRouter.js');
var LoginView = require('./loginView.js');
var MovieView = require('./movieCollectionView.js');
var UserView = require('./userView.js');
var EditView = require('./editView.js');
var AddView = require('./addView.js');
var loginView;
var userView;
var moviesView;
var editView;
var addView;
var vent = _.extend({}, Backbone.Events);

vent.on('movie:show:editView', function(movieView) {
  moviesView.$el.hide();
  userView.$el.hide();
  addView.$el.hide();
  loginView.$el.hide();

  editView.show(movieView);
});

vent.on('edit:close', function() {
  loginView.$el.hide();
  editView.$el.hide();
  addView.$el.hide();

  userView.$el.show();
  moviesView.reRender();
  moviesView.$el.show();
});

vent.on('movie:add', function(model) {
  moviesView.appendItem(model);
  moviesView.reRender();
});

$('document').ready(function() {
  var currentUserId = document.cookie.split('=');
  var MovieModel = Backbone.Model.extend({
    urlRoot: '/movies',
    id: '',
    vent: vent,

    parse: function(model) {
      var attr = {
        id: model.id,
        title: model.title,
        addedBy: model.addedBy,
        link: model.link
      };

      return attr;
    }
  });

  var MovieCollection = Backbone.Collection.extend({
    model: MovieModel,
    url: '/movies',
    vent: vent,

    parse: function(response) {
      return response.data;
    }
  });

  var Movies = new MovieCollection();

  var UserModel = Backbone.Model.extend({
    url: '/',
    parse: function(model) {
      var attr = {
        id: model.data.id,
        username: model.data.username
      };

      return attr;
    }
  });

  var User = new UserModel();

  loginView = new LoginView({el: $('#loginWrapper')});
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
    vent: vent,
    userId: currentUserId[1]
  });
  addView.$el.hide();

  editView = new EditView({
    el: $('#editForm'),
    cookieId: currentUserId[1],
    collection: Movies
  });

  var router = new Router();

  router.on('route:loginPage', function() {
    moviesView.$el.hide();
    userView.$el.hide();
    addView.$el.hide();
    editView.$el.hide();

    loginView.$el.show();
  });

  router.on('route:startApp', function() {
    loginView.$el.hide();
    editView.$el.hide();
    addView.$el.hide();

    moviesView.fetchData();
    userView.fetchData();

    userView.$el.show();
    moviesView.$el.show();
  });

  router.on('route:returnToLogin', function(redirect) {
    document.location = redirect;
  });

  router.on('route:updateMovieTitle', function(movieId) {

  });

  router.on('route:addMovie', function() {
    moviesView.$el.hide();
    userView.$el.hide();
    loginView.$el.hide();
    editView.$el.hide();

    addView.$el.show();
  });
  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});
