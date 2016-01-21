'use strict';

//edit model '/email' route

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var editTemplate = require('../../templates/edit.hbs');

var EditView = Backbone.View.extend({
  template: editTemplate,

  events: {
    'click #submit': 'updateMovie',
    'click #cancel': 'cancel'
  },

  initialize: function(options) {
    var self = this;
    this.options = options;
    _.bindAll(this, 'render', 'show', 'hide', 'cancel', 'updateMovie');
    this.listenTo(self.collection, 'remove add change sync', self.render);
  },

  render: function() {
    var html = this.template();

    $(this.el).html(html);
  },

  show: function() {
    var self = this;
    this.listenTo(self.collection, 'remove add change sync', self.render);

    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  getMovieId: function(movieId) {
    this.movieId = movieId;
  },

  updateMovie: function() {
    var self = this;
    var movie = this.collection.findWhere({id: self.movieId});
    var update = $('#titleUpdate').val().trim('string');
    var title = movie.get('title');

    if(update === '') {
      Backbone.Events.trigger('alert', 'Title update required!', 'Edit error');
      return;
    }

    movie.set({
      update: update,
      title: update
    });

    movie.save(null, {
      success: function(model, response) {
        $('#titleUpdate').val('');
        router.navigate('movies', {trigger: true});
      },
      error: function(model, response) {
        var msg = response.responseText.split('"');
        Backbone.Events.trigger('alert', 'Error updating movie', 'Update error');
      }
    });
  },

  cancel: function() {
    this.$el.hide();
    router.navigate('movies', {trigger: true});
  }
});

module.exports = EditView;
