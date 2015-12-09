'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var Router = require('./backboneRouter.js');
var addMovieTemplate = require('../../templates/addMovieTemplate.handlebars');

var router = new Router();

var AddView = Backbone.View.extend({
  events: {
    'click #addMovie': 'addMovie',
    'click #cancelAdd': 'cancelAdd'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'addMovie', 'cancelAdd');
    this.options = options;

    this.render();
  },

  render: function() {
    var self = this;
    self.$el.html(addMovieTemplate());
  },

  addMovie: function() {
    var self = this;
    var title = $('#addTitle').val().trim('string');
    var link = $('#addLink').val().trim('string');

    var Movie = new this.options.movieModel({
      title: title,
      link: link,
      addedBy: self.options.userId
    });

    Movie.save(null, {success: function(model, response) {
      self.options.vent.trigger('movie:add', model);
      router.navigate('movies', {trigger: true});
    }});
  },

  cancelAdd: function() {
    this.$el.hide();
    router.navigate('movies', {trigger: true});
  }
});

module.exports = AddView;
