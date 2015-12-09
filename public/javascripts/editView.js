'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Router = require('./backboneRouter.js');
var editTemplate = require('../../templates/editTemplate.handlebars');

var router = new Router();

var EditView = Backbone.View.extend({
  events: {
    'click #submit': 'updateMovie',
    'click #cancel': 'cancel'
  },

  initialize: function(options) {
    var self = this;
    _.bindAll(this, 'render', 'updateMovie', 'cancel', 'show');

    self.render();
  },

  render: function() {
    var self = this;

    $(self.el).html(editTemplate());
    return self;
  },

  show: function(movieView) {
    this.model = movieView.model;
    this.movieView = movieView;
    this.$el.show();
  },

  updateMovie: function() {
    var self = this;
    var movieTitleUpdate = $('#titleUpdate').val().trim('string');

    this.movieView.updateMovie(movieTitleUpdate);
    //this.model.vent.trigger('movie:update', movieTitleUpdate);
  },

  cancel: function() {
    this.$el.hide();
    this.model.vent.trigger('edit:close');
  }
});

module.exports = EditView;
