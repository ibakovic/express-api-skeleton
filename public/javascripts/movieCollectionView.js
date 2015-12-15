'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var router = require('./backboneRouter.js');
var MovieView = require('./movieView.js');

var MovieCollectionView = Backbone.View.extend({
  initialize: function(options) {
    var self = this;
    self.options = options;
    self.childrenViewsArray = [];

    self.collection = self.options.collection;

    _.bindAll(this, 'render', 'afterRender', 'appendItem');

    _.wrap(this.render, function(render) {
      render();
      self.afterRender();
    });
  },

  render: function() {
    var self = this;

    this.$el.empty();
    this.childrenViewsArray.forEach(function(view) {
      view.remove();
    });

    this.collection.models.forEach(function(movie) {self.appendItem(movie);});
    return self;
  },

  afterRender: function() {
    var self = this;
    //listen after render
    self.listenTo(self.collection, 'remove add change', self.render);
    self.listenTo(self.collection, 'add', self.render);
    self.listenTo(self.collection, 'change', self.render);
  },

  appendItem: function(movie) {
    var movieView = new MovieView({ model: movie });

    movieView.render();

    this.childrenViewsArray.push(movieView);

    this.$el.append(movieView.$el);
  }
});

module.exports = MovieCollectionView;
