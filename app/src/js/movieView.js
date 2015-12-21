'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var movieTemplate = require('../../../templates/movieTemplate.handlebars');

var MovieView = Backbone.View.extend({
  template: movieTemplate,

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

    var username = this.model.get('addedBy').username;

    var template = self.template({
      title: self.model.get('title'),
      movieId: self.model.get('id'),
      addedBy: username,
      picture: '/images',
      created: self.model.get('created')
    });
    this.$el.html(template);
  },

  removeView: function() {
    this.remove();
  },

  deleteMovie: function() {
    var self = this;

    Backbone.Events.trigger('prompt', 'Are you sure you want to delete "' + self.model.get('title') + '"?', 'Delete', 'deleteMovie:' + self.model.get('id'));
    Backbone.Events.on('prompt:confirm:deleteMovie:' + self.model.get('id'), function(confirm) {
      if(confirm)
        return self.model.destroy();
    });
  },

  editMovie: function() {
    var self = this;
    router.navigate('edit/' + self.model.get('id'), {trigger: true});
  }
});

module.exports = MovieView;
