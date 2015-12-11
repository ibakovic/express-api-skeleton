'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var router = require('./backboneRouter.js');
var editTemplate = require('../../templates/editTemplate.handlebars');

var EditView = Backbone.View.extend({
  events: {
    'click #submit': 'updateMovie',
    'click #cancel': 'cancel'
  },

  initialize: function(options) {
    var self = this;
    self.options = options;
    self.collection = self.options.collection;
    _.bindAll(this, 'render', 'cancel', 'updateMovie');
  },

  render: function() {
    var self = this;

    $(self.el).html(editTemplate());
    return self;
  },

  getMovieId: function(movieId) {
    this.movieId = movieId;
  },

  updateMovie: function() {
    var self = this;
    var movie = this.collection.findWhere({id: self.movieId});
    var update = $('#titleUpdate').val().trim('string');

    console.log(this.collection);

    movie.set({
      update: update
    });

    movie.save(null, {
      success: function(model, response) {
        router.navigate('movies', {trigger: true});
      }
    });
  },

  cancel: function() {
    this.$el.hide();
    router.navigate('movies', {trigger: true});
  }
});

module.exports = EditView;
