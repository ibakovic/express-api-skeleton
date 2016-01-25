'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var router = require('./backboneRouter.js');
var MovieView = require('./movie.js');
var allMoviesTemplate = require('../../templates/movieCollection.hbs');

var AllMoviesView = Backbone.View.extend({
  template: allMoviesTemplate,

  childrenViewsArray: [],

  events: {
    'click #loginRedirect': 'loginRedirect'
  },

  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'show', 'hide', 'appendMovie', 'loginRedirect');
  },

  render: function() {
    var self = this;
    var html = this.template();

    //this.$el.empty();
    this.$el.html(html);

    this.collection.models.forEach(function(movie) {
      self.appendMovie(movie);
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

    this.$('#allMoviesContainer').append(movieView.$el);
  },

  listen: function() {
    this.listenTo(this.collection, 'reset', this.render);
  },

  loginRedirect: function() {
    router.navigate('loginPage', {trigger: true});
  }
});

module.exports = AllMoviesView;
