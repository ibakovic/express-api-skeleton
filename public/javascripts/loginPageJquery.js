var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var lodash = require('lodash');
var format = require('string-template');
var moviesTemplate = require('../../templates/moviesTemplate.handlebars');
var usersTemplate = require('../../templates/usersTemplate.handlebars');
var getInfoTemplate = require('../../templates/getInfoTemplate.handlebars');

$('document').ready(function() {
  $('#register').click(function() {
    $.post('/register', {
      username: $('#username').val(),
      password: $('#password').val()
    },
    function(data, status) {
      alert('Message: ' + data.msg + '\nStatus: ' + status);
    });
  });

  $('#login').click(function() {
    $.post('/login', {
      username: $('#username').val(),
      password: $('#password').val()
    },
    function(data, status) {
      alert('Data: ' + data.msg + '\nStatus: ' + status);
    });
  });

  var UserModel = Backbone.Model.extend({
    url: '/'
  });

  var UserCollection = Backbone.Collection.extend({
    model: UserModel,
    url: '/'
  });

  var Users = new UserCollection();

  var UserView = Backbone.View.extend({
    el: $('#userInfo'),
    contentEl: $('#userContent'),
    getInfoEl: $('#getUserInfo'),

    events: {
      'click #getUserInfo': 'getUserInfo',
      'click #hideUserInfo': 'hideUserInfo',
      'click #updatePassword': 'updatePassword'
    },

    initialize: function() {
      var self = this;
      _.bindAll(this, 'render', 'getUserInfo', 'hideUserInfo', 'updatePassword');

      var serverResponse = new UserCollection();

      serverResponse.fetch({success: function(model, response) {
        self.collection = new UserCollection(response.data);

        self.listenTo(self.collection, 'change', self.render(getInfoTemplate()));
      }});

      this.render(getInfoTemplate());
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
    }
  });

  var userView = new UserView();

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

  var MovieView = Backbone.View.extend({
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

      if(!self.getCurrentUser){
        $(self.$el).empty();

        $(self.el).append(self.loginEl);
        return self;
      }

      $(self.$el).empty();

      $(self.$el).append(self.addEl);

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

var movieView = new MovieView();
});
