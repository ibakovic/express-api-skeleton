'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var MovieView = require('./userMovie.js');
var movieTemplate = require('../../templates/userMovie.hbs');
var movieCollectionTemplate = require('../../templates/userMovieCollection.hbs');

var UserMovieCollectionView = Backbone.View.extend({
  template: movieCollectionTemplate,
  movieTemplate: movieTemplate,

  initialize: function(options) {
    var self = this;
    self.options = options;
    self.childrenViewsArray = [];

    _.bindAll(this, 'render', 'show', 'hide', 'appendItem', 'listen', 'renderAddedItem', 'renderModifiedItem');
  },

  render: function() {
    var self = this;
    var html = this.template();

    this.$el.empty();
    this.$el.html(html);
    /*var i = 0;
    this.childrenViewsArray.forEach(function(view) {
      i++;
      view.remove();
    });*/
    this.collection.models.forEach(function(movie) {self.appendItem(movie);});
    return self;
  },

  show: function() {
    this.listen();
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

    //this.childrenViewsArray.push(movieView);

    this.$('#mainContainer').append(movieView.$el);
  },

  listen: function() {
    this.listenTo(this.collection, 'reset', this.render);
    this.collection.bind('addMovie', this.renderAddedItem);
    this.collection.bind('change:title', this.renderModifiedItem);
  },

  renderAddedItem: function() {
    var lastItem = this.collection.at(this.collection.length - 1);
    this.appendItem(lastItem);
    this.collection.off('addMovie');
  },

  renderModifiedItem: function() {
    var self = this;
    this.collection.models.forEach(function(model) {
      if(model.hasChanged('title')) {
        var username = model.get('addedBy').username;
        var imageUrl = /public/ + model.get('image');

        var html = self.movieTemplate({
          title: model.get('title'),
          link: model.get('link'),
          movieId: model.get('id'),
          addedBy: username,
          pictureUrl: imageUrl,
          created: model.get('created')
        });

        $('#' + model.get('id')).replaceWith(html);
      }
    });

    this.collection.off('change:title');
  }
});

module.exports = UserMovieCollectionView;
