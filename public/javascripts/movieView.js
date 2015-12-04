'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Router = require('./backboneRouter.js');
var addMovieTemplate = require('../../templates/addMovieTemplate.handlebars');
var moviesTemplate = require('../../templates/moviesTemplate.handlebars');

var router = new Router();

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

var Movies = new MovieCollection();

var MovieView = Backbone.View.extend({
  events: {
    'click button#addMovie': 'addMovie',
    'click .deleteMovie': 'deleteMovie',
    'click .updateMovie': 'updateMovie',
    'click #getUserInfo': 'getUserInfo'
  },

  initialize: function(options) {
    var self = this;
    self.options = options;

    _.bindAll(this, 'render', 'addMovie', 'appendItem', 'deleteMovie');

    var movieCollectionArray = new MovieCollection();

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

  addMovie: function() {
    var self = this;

    var movie = new MovieModel({
      title: $('#title').val(),
      link: $('#link').val(),
      addedBy: self.options.cookieId
    });
    movie.save(null, {success: function(model, response) {
      self.collection.add(model);
    }});
  },

  deleteMovie: function(htmlElement) {
    var self = this;
    var movieTitle = $(htmlElement.currentTarget).siblings('div.movieTitle').text().trim('string');

    var movie = self.collection.findWhere({
      title: movieTitle,
      addedBy: self.options.cookieId
    });

    movie.destroy();
  },

  updateMovie: function(htmlElement) {
    var self = this;
    var movieTitle = $(htmlElement.currentTarget).siblings('div.movieTitle').text().trim('string');
    var movieTitleUpdate = $(htmlElement.currentTarget).siblings('input.titleUpdate').val().trim('string');

    var movie = self.collection.findWhere({
      title: movieTitle,
      addedBy: self.options.cookieId
    });

    if(!movie)
      return alert('Movie not found!');

    movie.set({
      update: movieTitleUpdate
    });

    movie.save();
  }
});

module.exports = MovieView;
