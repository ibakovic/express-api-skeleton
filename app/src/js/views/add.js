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

    function sendData() {
      var currentUserId = document.cookie.split('=');
      var title = $('#addTitle').val().trim();
      var link = $('#addLink').val().trim();
      var image = $('#image').val();

      if(title === '') {
        Backbone.Events.trigger('alert', 'Title required!', 'Add movie error');
        return;
      }

      if(!image)
        return Backbone.Events.trigger('alert', 'Please select an image before submitting changes', 'Image not uploaded');

      var XHR = new XMLHttpRequest();

      // We bind the FormData object and the form element
      var FD  = new FormData(form);

      // We define what will happen if the data are successfully sent
      /*XHR.addEventListener("load", function(event) {
        //
      });*/

      // We define what will happen in case of error
      XHR.addEventListener("error", function(event) {
        Backbone.Events.trigger('alert', response.msg, 'Failed to add your movie');
      });

      // We setup our request
      XHR.open("POST", "http://localhost:8080/users/movies");

      // The data sent are the one the user provide in the form
      XHR.send(FD);

      location.reload();
      router.navigate('movies', {trigger: true});
    }

    // We need to access the form element
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
