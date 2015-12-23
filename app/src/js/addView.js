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
    _.bindAll(this, 'render', 'getImgId', 'uploadImage', 'addMovie', 'cancelAdd');
    this.options = options;
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
  },

  getImgId: function(imgId) {
    this.imgId = imgId;
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

    if(this.imgId === 'noImg')
      return Backbone.Events.trigger('alert', 'Please upload an image before submitting changes', 'Image not uploaded');

    var Movie = new self.options.movieModel({
      title: title,
      link: link,
      addedBy: self.options.userId,
      imageId: self.imgId
    });

    Movie.save(null, {
      success: function(model, response) {
        model.set({'addedBy': response.data.addedBy});
        model.set({'imageUrl': response.data.addedBy + '/' + title});
        Backbone.Events.trigger('movie:add', model);

        self.$el.hide();
        router.navigate('movies', {trigger: true});
      },
      error: function(model, response) {
        Backbone.Events.trigger('alert', response.msg, 'Failed to add your movie');
    }});
  },

  cancelAdd: function() {
    this.$el.hide();
    router.navigate('movies', {trigger: true});
  }
});

module.exports = AddView;
