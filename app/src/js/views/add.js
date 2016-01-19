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
    var currentUserId = document.cookie.split('=');
    var title = $('#addTitle').val().trim();
    var link = $('#addLink').val().trim();
    var image = $('#image').val();

    if(title === '') {
      Backbone.Events.trigger('alert', 'Title required!', 'Add movie error');
      return;
    }

    if(!image) {
      Backbone.Events.trigger('alert', 'Please select an image before submitting changes', 'Image not uploaded');
      return;
    }

    var extension = image.split('.')[1];
    var regex = /png|gif|tiff|jpeg|jpg/i;

    // Check if the submitted file is an image
    if(!regex.test(extension)) {
      Backbone.Events.trigger('alert', 'Your file is not an image!', 'Add movie error');
      return;
    }

    function sendData() {
      var XHR = new XMLHttpRequest();

      // Bind the FormData object and the form element
      var FD  = new FormData(form);

      // Define what will happen if the data are successfully sent
      XHR.addEventListener("load", function(event) {
        var response = event.target.response.split('"data":')[1].split('"');
        var movieParams = {
          title: response[3],
          link: response[7],
          addedBy: {
            username: response[13],
            id: response[23]
          },
          imageLink: response[27],
          imageType: response[31],
          created: response[35],
          id: response[39]
        };

        var Movie = new self.options.model(movieParams);

        Backbone.Events.trigger('movie:add', Movie);
        //router.navigate('movies', {trigger: true});
      });

      // Define what will happen in case of error
      XHR.addEventListener("error", function(event) {
        Backbone.Events.trigger('alert', 'An error has occured', 'Failed to add your movie');
      });

      // Detup request
      XHR.open("POST", "http://localhost:8080/users/movies");

      // The data sent are the one the user provide in the form
      XHR.send(FD);

      //location.reload();
      router.navigate('movies', {trigger: true});
    }

    // Access the form element
    var form = document.getElementById("addMovieForm");

    // to takeover its submit event.
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      sendData();
    });
  },

  cancelAdd: function() {
    router.navigate('movies', {trigger: true});
  }
});

module.exports = AddView;
