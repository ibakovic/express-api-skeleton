'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var router = require('./backboneRouter.js');
var addMovieTemplate = require('../../../templates/addMovieTemplate.handlebars');

var AddView = Backbone.View.extend({
  template: addMovieTemplate,

  events: {
    'click #addMovie': 'addMovie',
    'click #cancelAdd': 'cancelAdd'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'addMovie', 'cancelAdd');
    this.options = options;
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
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
      Backbone.Events.trigger('movie:add', model);
      router.navigate('movies', {trigger: true});
    }});
  },

  cancelAdd: function() {
    this.$el.hide();
    router.navigate('movies', {trigger: true});
  }
});

module.exports = AddView;
