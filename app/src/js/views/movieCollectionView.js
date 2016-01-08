'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var MovieView = require('./movieView.js');
var movieCollectionTemplate = require('../../../../templates/movieCollectionTemplate.handlebars');

var MovieCollectionView = Backbone.View.extend({
  template: movieCollectionTemplate,
  initialize: function(options) {
    var self = this;
    self.options = options;
    self.childrenViewsArray = [];

    self.collection = self.options.collection;

    _.bindAll(this, 'render', 'afterRender', 'show', 'hide', 'appendItem');

    _.wrap(this.render, function(render) {
      render();
      self.afterRender();
    });
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

  afterRender: function() {
    var self = this;
    //listen after render
    self.listenTo(self.collection, 'remove add change', self.render);
    self.listenTo(self.collection, 'add', self.render);
    self.listenTo(self.collection, 'change', self.render);
  },

  show: function() {
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  appendItem: function(movie) {
    var self = this;
    var movieView = new MovieView({ model: movie });

    movieView.render();

    this.childrenViewsArray.push(movieView);

    this.$('#mainContainer').append(movieView.$el);
  }
});

module.exports = MovieCollectionView;
