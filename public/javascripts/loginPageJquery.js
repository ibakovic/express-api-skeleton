var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var lodash = require('lodash');
var format = require('string-template');
var moviesTemplate = require('../../templates/moviesTemplate.handlebars');
var usersTemplate = require('../../templates/usersTemplate.handlebars');
var getInfoTemplate = require('../../templates/getInfoTemplate.handlebars');
var loginTemplate = require('../../templates/loginTemplate.handlebars');
var addMovieTemplate = require('../../templates/addMovieTemplate.handlebars');
var Radio = require('backbone.radio');

$('document').ready(function() {
  //var moviesChannel = Radio.channel('movies');
  var usersView;
  var moviesView;
  var loginView;
  var LoginView;
  var MovieView;
  var UserView;

  var Router = Backbone.Router.extend({
      routes: {
        '': 'loginPage',
        'login': 'returnToLogin',
        'movies': 'startApp'
      },

      loginPage: function() {
        loginView = new LoginView();
      },

      returnToLogin: function() {
        alert('Logging off');
        if(usersView)
          usersView.$el.hide();

        if(moviesView)
          moviesView.$el.hide();

        //var newLoginView = new LoginView();

        loginView.$el.show();
      },

      startApp: function() {
        usersView = new UserView();
        moviesView = new MovieView();

        usersView.$el.show();
        moviesView.$el.show();

        if(loginView)
          loginView.$el.hide();
      }
  });
  // Initiate the router
  var router = new Router();

  var LoginModel = Backbone.Model.extend({
    url: '/login'
  });

  var LoginCollection = Backbone.Collection.extend({
    model: LoginModel
  });

  var LogoutModel = Backbone.Model.extend({
    url: '/logout'
  });

  var RegisterModel = Backbone.Model.extend({
    url: '/register'
  });

  var Login = new LoginCollection();

  LoginView = Backbone.View.extend({
    el: $('#loginWrapper'),

    events: {
      'click #login': 'login',
      'click #register': 'register'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'login', 'register');
      var self = this;

      this.render(loginTemplate());
    },

    render: function(content) {
      var self = this;
      $(self.$el).html(content);
    },

    login: function() {
      var self = this;
      var credentials = new LoginModel({
        username: $('#username').val().trim('string'),
        password: $('#password').val().trim('string')
      });
      credentials.save(null, {
        success: function(model, response) {
          alert(response.msg);
          router.navigate('movies', true);
        },
        error: function() {
          alert('Log in not successful!');
        }
      });
    },

    register: function() {
      var self = this;
      var credentials = new RegisterModel({
        username: $('#username').val().trim('string'),
        password: $('#password').val().trim('string')
      });

      credentials.save(null, {
        success: function(model, res) {
          alert(res.msg);
        },
        error: function(model, res) {
          alert('Register not successful!');
        }
      });
    },

    getUserId: function() {
      var currentUser =  document.cookie.split('=');
      return currentUser[1];
    }
  });

  var UserModel = Backbone.Model.extend({
    url: '/'
  });

  var UserCollection = Backbone.Collection.extend({
    model: UserModel,
    url: '/'
  });

  var Users = new UserCollection();

  UserView = Backbone.View.extend({
    el: $('#userInfo'),
    contentEl: $('#userContent'),
    getInfoEl: $('#getUserInfo'),

    events: {
      'click #getUserInfo': 'getUserInfo',
      'click #hideUserInfo': 'hideUserInfo',
      'click #updatePassword': 'updatePassword',
      'click #logout': 'logout'
    },

    initialize: function() {
      var self = this;
      _.bindAll(this, 'render', 'getUserInfo', 'hideUserInfo', 'updatePassword', 'logout');

      var serverResponse = new UserCollection();

      serverResponse.fetch({success: function(model, response) {
        self.collection = new UserCollection(response.data);

        self.listenTo(self.collection, 'change', self.render(getInfoTemplate()));
      }});

      this.render(getInfoTemplate());
    },

    test: function() {
      console.log('test213213');
    },

    render: function(content) {
      var self = this;
      $(self.contentEl).html(content);
    },

    getUserId: function() {
      var currentUser =  document.cookie.split('=');
      return currentUser[1];
    },

    getUserInfo: function() {
      var self = this;
      var user = self.collection.findWhere({id: self.getUserId()});

      var template = usersTemplate({
        username: user.get('username'),
        userId: user.get('id')
      });

      self.render(template);
    },

    hideUserInfo: function() {
      this.render(getInfoTemplate());
    },

    updatePassword: function(htmlElement) {
      var self = this;
      var updatedPassword = $(htmlElement.currentTarget).siblings('#updatePasswordText').val().trim('string');

      var user = self.collection.findWhere({id: self.getUserId()});
      console.log('getUserId', self.getUserId());

      user.set({
        update: updatedPassword
      });
      console.log('collection', self.collection);
      //self.collection.set(user);
      user.save(null, {
        success: function(model, response) {
          alert(response.msg);
        },
        error: function(model, response) {
          alert(response.msg);
          self.collection.set(model);
        }
      });
    },

    logout: function() {
      var logOut = new LogoutModel();

      router.navigate('login', true);
      logOut.fetch();
    }
  });

  var MovieModel = Backbone.Model.extend({
    urlRoot: '/movies',
    id: '',

    parse: function(model) {
      var attr = {
        id: model.data._id,
        title: model.data.title,
        addedBy: model.data.addedBy,
        link: model.data.link
      };

      return attr;
    }
  });

  var MovieCollection = Backbone.Collection.extend({
    model: MovieModel,
    url: '/movies'
  });

  Movies = new MovieCollection();

  MovieView = Backbone.View.extend({
    userCollection: Users,

    el: $('#mainContainer'),
    resEl: $('#responseContainer'),
    loginEl: $('#loginWrapper'),
    addEl: $('#addMovieWrapper'),
    userInfoEl: $('#userInfoWrapper'),
    addUserEl: $('#userInfo'),

    events: {
      'click button#addMovie': 'addMovie',
      'click .deleteMovie': 'deleteMovie',
      'click .updateMovie': 'updateMovie',
      'click #getUserInfo': 'getUserInfo'
    },

    initialize: function() {
      var self = this;

      _.bindAll(this, 'render', 'addMovie', 'appendItem', 'deleteMovie');

      var userCollectionArray = new UserCollection();
      var movieCollectionArray = new MovieCollection();

      userCollectionArray.fetch({success: function(collection, response) {
        self.userCollection = new UserCollection(response.data);
      }});

      movieCollectionArray.fetch({success: function(collection, response) {
        self.collection = new MovieCollection(response.data);

        self.listenTo(self.collection, 'remove', self.render);
        self.listenTo(self.collection, 'add', self.render);
        self.listenTo(self.collection, 'change', self.render);

        self.render();
      }});
    },

    render: function() {
      var self = this;

      $(self.$el).empty();

      $(self.$el).append(addMovieTemplate());

      self.collection.models.forEach(function(movie) {self.appendItem(movie);});
    },

    appendItem: function(movie) {
      var self = this;

      $(self.$el).append(moviesTemplate({
        title: movie.get('title'),
        addedBy: movie.get('addedBy')
      }));
    },

    getCurrentUser: function() {
      var currentUser =  document.cookie.split('=');
      return currentUser[1];
    },

    addMovie: function() {
      var self = this;

      var movie = new MovieModel({
        title: $('#title').val(),
        link: $('#link').val(),
        addedBy: self.getCurrentUser()
      });
      movie.save(null, {success: function(model, response) {
        console.log('Success!', response, model);
        self.collection.add(model);
      }});
    },

    deleteMovie: function(htmlElement) {
      var self = this;
      var movieTitle = $(htmlElement.currentTarget).parent().children('div.movieTitle').text().trim('string');

      var movie = self.collection.findWhere({
        title: movieTitle,
        addedBy: self.getCurrentUser()
      });

      movie.destroy();
    },

    updateMovie: function(htmlElement) {
      var self = this;
      var movieTitle = $(htmlElement.currentTarget).parent().children('div.movieTitle').text().trim('string');
      var movieTitleUpdate = $(htmlElement.currentTarget).siblings('input.titleUpdate').val().trim('string');

      var movie = self.collection.findWhere({
        title: movieTitle,
        addedBy: self.getCurrentUser()
      });

      if(!movie)
        return alert('Movie not found!');

      movie.set({
        update: movieTitleUpdate
      });

      movie.save();
    }
  });
// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();
});
