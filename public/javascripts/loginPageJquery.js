var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var lodash = require('lodash');
var format = require('string-template');

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
    model: Movies,

    el: $('#responseContainer'),

    events: {
      'click button#addMovie': 'addMovie',
      'click .deleteMovie': 'deleteMovie'
    },

    initialize: function() {
      var self = this;

      _.bindAll(this, 'render', 'addMovie', 'getDeleteButton', 'appendItem', 'deleteMovie');

      var arrayCollection = new MovieCollection();

      arrayCollection.fetch({success: function(collection, response) {
        self.collection = new MovieCollection(response.data);

        self.listenTo(self.collection, 'remove', self.render);
        self.listenTo(self.collection, 'add', self.render);

        self.render();
      }});
    },

/*    _idHelper: function(data) {
      data.id = data._id;
      return data;
    },*/

    render: function() {
      var self = this;

      var insertTitle = '<input id="title" placeholder="Insert movie title here" /><br>';
      var insertLink = '<input id="link" placeholder="Insert movie link here" /><br>';
      var addMovie = '<button id="addMovie">Add <br>a movie</button><br><br><br<br><br>';

      $(self.$el).empty();
      $(self.el).append(insertTitle + insertLink + addMovie);
      self.collection.models.forEach(function(movie) {
        $(self.$el).append(format('{titleTag} {title} {idTag} {id} {addedByTag} {addedBy} </div> {updateMovieTag} {deleteButton}', {
          titleTag: self.getTitleTag(),
          title: movie.get('title'),
          idTag: self.getMovieIdTag(),
          id: movie.get('id'),
          addedByTag: self.getAddedByTag(),
          addedBy: movie.get('addedBy'),
          updateMovieTag: self.getUpdateMovieTag(),
          deleteButton: self.getDeleteButton()
        }));
      });
    },

    getUpdateMovieTag: function() {
      return '<br><input class="updatedTitle" placeholder="change title"> <button id="updateMovie"></button>';
    },

    getDeleteButton: function() {
      var deleteButton = '<br><button class="deleteMovie">Delete</button></li><br>';
      return deleteButton;
    },

    getTitleTag: function() {
      return '<li>Title: <div class="movieTitle">';
    },

    getMovieIdTag: function() {
      return '</div><div hidden class="movieId">';
    },

    getAddedByTag: function() {
      return '</div><br>Added by:<div class="addedBy">';
    },

    appendItem: function(movie) {
      var self = this;
      $(self.$el).append(format('{titleTag} {title} {idTag} {id} {addedByTag} {addedBy} </div> {deleteButton}', {
          titleTag: self.getTitleTag(),
          title: movie.get('title'),
          idTag: self.getMovieIdTag(),
          id: movie.get('id'),
          addedByTag: self.getAddedByTag(),
          addedBy: movie.get('addedBy'),
          deleteButton: self.getDeleteButton()
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

    deleteMovie: function(e) {
      var self = this;
      var movieTitle = $(e.currentTarget).parent().children('div.movieTitle').text().trim('string');
      var movieParent = $(e.currentTarget).parent();

      var movie = self.collection.findWhere({
        title: movieTitle,
        addedBy: self.getCurrentUser()
      });

      movie.destroy();
    }
  });

  var movieView = new MovieView();
});
