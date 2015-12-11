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
    _.bindAll(this, 'render', 'cancel', 'getModel', 'updateMovie');
  },

  render: function() {
    var self = this;

    $(self.el).html(editTemplate());
    return self;
  },

  getModel: function(model) {
    this.model = model;
  },

  updateMovie: function() {
    var self = this;
    var movie = this.model;
    var update = $('#titleUpdate').val().trim('string');

    movie.set({
      update: update
    });

    console.log('edit view', movie);

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
