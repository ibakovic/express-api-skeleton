'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var movieTemplate = require('../../templates/movie.hbs');

var MovieView = Backbone.View.extend({
  template: movieTemplate,

  initialize: function(options) {
    this.options = options;
    this.model = this.options.model;
    _.bindAll(this, 'render');
  },

  render: function() {
    var self = this;

    var username = this.model.get('addedBy').username;
    var imageUrl = '/public/' + this.model.get('image');

    console.log(self.model);

    var html = this.template({
      pictureUrl: imageUrl,
      link: self.model.get('link'),
      movieId: self.model.get('id'),
      created: self.model.get('created'),
      addedBy: username,
      title: self.model.get('title')
    });

    this.$el.html(html);
  }
});

module.exports = MovieView;
