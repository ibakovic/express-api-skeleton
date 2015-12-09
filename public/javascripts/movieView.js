'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Router = require('./backboneRouter.js');
var movieTemplate = require('../../templates/movieTemplate.handlebars');

var router = new Router();

var movieView = Backbone.View.extend({
  events: {
    'click #deleteMovie': 'deleteMovie',
    'click #updateMovie': 'editMovie'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'deleteMovie', 'editMovie', 'removeView', 'updateMovie');
    this.options = options;
    this.model = this.options.model;

    this.listenTo(this.model, 'destroy', this.removeView);

    this.render();
  },

  render: function() {
    var self = this;

    var template = movieTemplate({
      title: self.model.get('title'),
      movieId: self.model.get('id'),
      addedBy: self.model.get('addedBy')
    });

    self.$el.html(template);
    return self;
  },

  removeView: function() {
    this.remove();
  },

  deleteMovie: function() {
    this.model.destroy({success: function(model, response) {
      alert(response.msg);
    }});
  },

  editMovie: function() {
    var self = this;
    this.model.vent.trigger('movie:show:editView', self);
  },

  updateMovie: function(update) {
    var self = this;
    var movie = this.model;
    movie.set({
      update: update
    });

    movie.save(null, {
      success: function(model, response) {
        self.model.vent.trigger('edit:close');
      }
    });
  }
});

module.exports = movieView;
