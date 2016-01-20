'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var MovieView = require('./movie.js');
var movieCollectionTemplate = require('../../templates/movieCollection.hbs');

var MovieCollectionView = Backbone.View.extend({
  template: movieCollectionTemplate,
  initialize: function(options) {
    var self = this;
    self.options = options;
    self.childrenViewsArray = [];

    _.bindAll(this, 'render', 'show', 'hide', 'appendItem', 'listen');
  },

  render: function() {
    var self = this;
    var html = this.template();

    this.$el.empty();
    this.$el.html(html);
    this.childrenViewsArray.forEach(function(view) {
      view.remove();
    });

    this.collection.models.forEach(function(movie) {self.appendItem(movie);});
    return self;
  },

  show: function() {
    this.render();
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  appendItem: function(movie) {
    var self = this;
    var movieView = new MovieView({
      model: movie
    });

    movieView.render();

    this.childrenViewsArray.push(movieView);

    this.$('#mainContainer').append(movieView.$el);
  },

  listen: function() {
    var self = this;
    self.listenTo(self.collection, 'add change sync request update create', self.render);
  }
});

module.exports = MovieCollectionView;
