'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Router = require('./backboneRouter.js');
var addMovieTemplate = require('../../templates/addMovieTemplate.handlebars');
var moviesTemplate = require('../../templates/moviesTemplate.handlebars');
var addMovieButtonTemplate = require('../../templates/addMovieButtonTemplate.handlebars');
var MovieView = require('./movieView.js');

var router = new Router();

var MovieCollectionView = Backbone.View.extend({
  events: {
    'click #cancelAdd': 'cancelAdd',
    'click #addMovieButton': 'openAddMovieForm',
    'click #getUserInfo': 'getUserInfo'
  },

  initialize: function(options) {
    var self = this;
    self.options = options;
    self.childrenViewsArray = [];

    self.collection = self.options.collection;

    _.bindAll(this, 'render', 'reRender', 'fetchData', 'cancelAdd', 'appendItem', 'openAddMovieForm', 'update');

    self.listenTo(self.collection, 'remove', self.loadTemplate);
    self.listenTo(self.collection, 'add', self.loadTemplate);
    self.listenTo(self.collection, 'change', self.loadTemplate);

    self.render();
  },

  render: function() {
    var self = this;

    $(self.$el).empty();
    this.childrenViewsArray.forEach(function(movieView) {
      movieView.remove();
    });

    $(self.$el).html(addMovieButtonTemplate());

    self.collection.models.forEach(function(movie) {self.appendItem(movie);});
  },

  reRender: function() {
    var self = this;

    self.collection.fetch({success: function(collection, response) {
      self.render();
    }});
  },

  fetchData: function() {
    var self = this;
    self.collection.fetch({success: function(collection, response) {
      self.render();
    }});
  },

  appendItem: function(movie) {
    var self = this;
    var Movie = new MovieView({ model: movie });

    this.childrenViewsArray.push(Movie);

    $(self.$el).append(Movie.$el);
  },

  openAddMovieForm: function() {
    this.$el.hide();
    router.navigate('addMovie', {trigger: true});
  },

  cancelAdd: function() {
    this.$el.hide();
    router.navigate('movies', {trigger: true});
  },

  addMovie: function() {
    var self = this;

    var movie = {
      title: $('#title').val(),
      link: $('#link').val(),
      addedBy: self.options.cookieId
    };
    self.collection.create(movie, {success: function(model, response) {
      self.collection.add(model);
      self.undelegateEvents();
      self.$el.hide();
      router.navigate('movies', {trigger: true});
    }});
  },

  update: function(update) {}
});

module.exports = MovieCollectionView;
