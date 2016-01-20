'use strict';

var Backbone = require('backbone');
var _ = require('lodash');
var $ = require('jquery');
var router = require('./backboneRouter.js');
var popsicle = require('popsicle');
var addMovieTemplate = require('../../templates/addMovie.hbs');

var AddView = Backbone.View.extend({
  template: addMovieTemplate,

  events: {
    'click #addMovie': 'addMovie',
    'click #cancelAdd': 'cancelAdd'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'show', 'hide', 'addMovie', 'cancelAdd');
    this.options = options;
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
  },

  show: function() {
    this.render();
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  addMovie: function() {
    var self = this;
    var $title = $('#addTitle').val().trim();
    var $link = $('#addLink').val().trim();
    var $image = $('#image');

    if($title === '') {
      Backbone.Events.trigger('alert', 'Title required!', 'Add movie error');
      return;
    }

    if(!$image.val()) {
      Backbone.Events.trigger('alert', 'Please select an image before submitting changes', 'Image not uploaded');
      return;
    }

    var extension = $image.val().split('.')[1];
    var regex = /png|gif|tiff|jpeg|jpg/i;

    // Check if the submitted file is an image
    if(!regex.test(extension)) {
      Backbone.Events.trigger('alert', 'Your file is not an image!', 'Add movie error');
      return;
    }

    var form = popsicle.form({
      title: $title,
      link: $link,
      image: $image[0].files[0]
    });

    popsicle.post({
      url: '/users/movies',
      body: form
    })
    .then(function AddMovieSuccess(res) {
      if(!res.body.success) {
        Backbone.Events.trigger('alert', res.body.msg, 'Add movie error');
        return;
      }

      router.navigate('movies', {trigger: true});
    })
    .error(function AddMovieError(res) {
      Backbone.Events.trigger('alert', res.body.msg, 'Add movie error');
    });
  },

  cancelAdd: function() {
    router.navigate('movies', {trigger: true});
  }
});

module.exports = AddView;
