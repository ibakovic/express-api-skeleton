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
    var $title = $('#addTitle').val().trim();
    var $link = $('#addLink').val().trim();
    var $image = $('#image').val();

    if($title === '') {
      Backbone.Events.trigger('alert', 'Title required!', 'Add movie error');
      return;
    }

    if(!$image) {
      Backbone.Events.trigger('alert', 'Please select an image before submitting changes', 'Image not uploaded');
      return;
    }

    var extension = $image.split('.')[1];
    var regex = /png|gif|tiff|jpeg|jpg/i;

    // Check if the submitted file is an image
    if(!regex.test(extension)) {
      Backbone.Events.trigger('alert', 'Your file is not an image!', 'Add movie error');
      return;
    }

    var $form = this.$el.find('#addMovieForm');

    var form = popsicle.form({
      title: $title,
      link: $link,
      image: $form[0][0].files[0]
    });

    popsicle.post({
      url: '/users/movies',
      body: form
    })
    .then(function AddMovieSuccess(res) {
      console.log(res);
      router.navigate('movies', {trigger: true});
    })
    .error(function AddMovieError(res) {
      alert(res.msg);
    });

/*Content-Disposition: form-data; name="image"; filename="Background.png"
Content-Type: image/png*/

/*
    popsicle({
      method: 'POST',
      url: '/users/movies',
      body: form
    });
    .then(function completeAddMovie(res) {
      if(!res.success) {
        Backbone.Events.trigger('alert', res.msg, 'Add movie error');
        return;
      }
      var movieParams = res.data;

      var Movie = new self.options.model(movieParams);

      Backbone.Events.trigger('movie:add', Movie);
      console.log('success', Movie);
      router.navigate('movies', {trigger: true});
    });
*/
    /*function sendData(form) {
      var XHR = new XMLHttpRequest();

      // Bind the FormData object and the form element
      var FD  = new FormData(form);

      // Define what will happen if the data are successfully sent
      function loadd() {
        console.log('Entering loadd');
        var response = JSON.parse(XHR.responseText);
        if(!response.success) {
          Backbone.Events.trigger('alert', response.msg, 'Add movie error');
          return;
        }
        var movieParams = response.data;

        var Movie = new self.options.model(movieParams);

        Backbone.Events.trigger('movie:add', Movie);
        console.log('success', Movie);
        router.navigate('movies', {trigger: true});
      }

      // Define what will happen in case of error
      XHR.addEventListener("error", function(event) {
        Backbone.Events.trigger('alert', 'An error has occured', 'Failed to add your movie');
      });

      // Setup request
      XHR.open("POST", "http://localhost:8080/users/movies");

      // The data sent are the ones the user provided in the form
      XHR.send(FD);

      XHR.onload = loadd;
      //router.navigate('movies', {trigger: true});
    }

    var $form = this.$el.find('#addMovieForm');
    sendData($form[0]);*/
  },

  cancelAdd: function() {
    router.navigate('movies', {trigger: true});
  }
});

module.exports = AddView;
