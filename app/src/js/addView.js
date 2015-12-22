'use strict';

var Backbone = require('backbone');
var _ = require('lodash');
var $ = require('jquery');
var router = require('./backboneRouter.js');
var UploadImageView = require('./uploadImageView.js');
var addMovieTemplate = require('../../../templates/addMovieTemplate.handlebars');

var AddView = Backbone.View.extend({
  template: addMovieTemplate,

  events: {
    'click #goToUploadImage': 'uploadImage',
    'click #addMovie': 'addMovie',
    'click #cancelAdd': 'cancelAdd'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'uploadImage', 'addMovie', 'cancelAdd');
    this.options = options;
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
  },

  uploadImage: function() {
    var uploadImageView = new UploadImageView({el: $('#uploadImageContainer')});
    uploadImageView.render();
    uploadImageView.$el.show();
  },

  addMovie: function() {
    var self = this;
    var title = $('#addTitle').val().trim();
    var link = $('#addLink').val().trim();

    var Movie = new self.options.movieModel({
      title: title,
      link: link,
      addedBy: self.options.userId
    });

    Movie.save(null, {
      success: function(model, response) {
        console.log('Add movie success');
        model.set({'addedBy': response.data.addedBy});
        model.set({'imageUrl': response.data.addedBy + '/' + title});
        console.log('Add movie', model);
        Backbone.Events.trigger('movie:add', model);

        self.$el.hide();
        router.navigate('movies', {trigger: true});
      },
      error: function() {
        console.log('Add view error');
    }});
  },

  cancelAdd: function() {
    this.$el.hide();
    router.navigate('movies', {trigger: true});
  }
});

module.exports = AddView;
