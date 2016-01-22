'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var MovieView = require('./movie.js');
var allMoviesTemplate = require('../../templates/movieCollection.hbs');

var AllMoviesView = Backbone.View.extend({
  template: allMoviesTemplate,

  childrenViewsArray: [],

  events: {},

  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'show', 'hide', 'appendMovie');
  },

  render: function() {
    var self = this;
    var html = this.template();

    //this.$el.empty();
    this.$el.html(html);

    var i = 0;

    this.collection.models.forEach(function(movie) {
      if(i % 3 === 0) {
        var newRow = $('<div class="moviesRows row row-flex row-flex-wrap"></div>');
        self.$('#allMoviesContainer').append(newRow);
      }
      self.appendMovie(movie);
      i++;
    });
  },

  show: function() {
    this.listen();
    this.$el.show();
  },

  hide: function() {
    this.listen();
    this.$el.hide();
  },

  appendMovie: function(movie) {
    var self = this;
    var movieView = new MovieView({model: movie});

    movieView.render();

    this.childrenViewsArray.push(movieView);

    this.$('#allMoviesContainer').find('.moviesRows:last-child').append(movieView.$el);
  },

  listen: function() {
    this.listenTo(this.collection, 'reset', this.render);
  }
});

module.exports = AllMoviesView;
