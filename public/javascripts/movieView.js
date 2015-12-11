'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var router = require('./backboneRouter.js');
var movieTemplate = require('../../templates/movieTemplate.handlebars');

var MovieView = Backbone.View.extend({
  events: {
    'click #deleteMovie': 'deleteMovie',
    'click #updateMovie': 'editMovie'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'deleteMovie', 'editMovie', 'removeView');
    this.options = options;
    this.model = this.options.model;

    this.listenTo(this.model, 'destroy', this.removeView);
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
    Backbone.Events.trigger('movie:show:editView', self.model);
    router.navigate('edit', {trigger: true});
  }
});

module.exports = MovieView;
