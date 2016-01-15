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
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  addMovie: function() {
    var self = this;
    var title = $('#addTitle').val().trim();
    var link = $('#addLink').val().trim();
    var image = $('#image').val();

    if(title === '') {
      Backbone.Events.trigger('alert', 'Title required!', 'Add movie error');
      return;
    }

    if(!image)
      return Backbone.Events.trigger('alert', 'Please select an image before submitting changes', 'Image not uploaded');

    var Movie = new self.options.movieModel({
      title: title,
      link: link,
      addedBy: self.options.userId,
      imageId: self.imgId
    });
/*
    Movie.save(null, {
      success: function(model, response) {
        model.set({'addedBy': response.data.addedBy});
        model.set({'imageUrl': response.data.addedBy + '/' + title});
        Backbone.Events.trigger('movie:add', model);

        $('#addTitle').val('');
        $('#addLink').val('');

        //self.$el.hide();
        router.navigate('movies', {trigger: true});
      },
      error: function(model, response) {
        Backbone.Events.trigger('alert', response.msg, 'Failed to add your movie');
    }});*/
  },

  cancelAdd: function() {
    router.navigate('movies', {trigger: true});
  }
});

module.exports = AddView;
