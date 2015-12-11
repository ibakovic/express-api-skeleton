'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var router = require('./backboneRouter.js');
var addMovieTemplate = require('../../templates/addMovieTemplate.handlebars');
var moviesTemplate = require('../../templates/moviesTemplate.handlebars');
var addMovieButtonTemplate = require('../../templates/addMovieButtonTemplate.handlebars');
var MovieView = require('./movieView.js');

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

    _.bindAll(this, 'render', 'afterRender', 'appendItem', 'openAddMovieForm');

    _.wrap(this.render, function(render) {
      render();
      self.afterRender();
    });
  },

  render: function() {
    var self = this;

    self.$el.empty();
    //_.invoke(self.childrenViewsArray, 'remove');
    self.childrenViewsArray.forEach(function(view) {
      view.remove();
    });
    self.$el.html(addMovieButtonTemplate());

    self.collection.models.forEach(function(movie) {self.appendItem(movie);});
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
    var self = this;
    var movieView = new MovieView({ model: movie });

    movieView.render();

    this.childrenViewsArray.push(movieView);

    self.$el.append(movieView.$el);
  },

  openAddMovieForm: function() {
    this.$el.hide();
    router.navigate('addMovie', {trigger: true});
  }
});

module.exports = MovieCollectionView;
