'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var movieTemplate = require('../../templates/movie.hbs');

var MovieView = Backbone.View.extend({
  template: movieTemplate,

  events: {
    'click .addedBy': 'openUserInfo',
    'click #deleteMovie': 'deleteMovie',
    'click #updateMovie': 'editMovie'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'deleteMovie', 'editMovie', 'removeView', 'openUserInfo');
    this.options = options;
    this.model = this.options.model;

    this.listenTo(this.model, 'destroy', this.removeView);
  },

  render: function() {
    var self = this;

    this.model.fetch({success: function(model, response) {
      var username = model.get('addedBy').username;
      var imageUrl = response.imageUrl;
      var template = self.template({
        title: model.get('title'),
        link: model.get('link'),
        movieId: model.get('id'),
        addedBy: username,
        pictureUrl: imageUrl,
        created: model.get('created')
      });

      self.$el.html(template);
    }});
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
  },

  openUserInfo: function() {
    var self = this;
    router.navigate('userInfo/' + self.model.get('addedBy').username, {trigger: true});
  }
});

module.exports = MovieView;
