'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var loginTemplate = require('../../../templates/loginTemplate.handlebars');
var router = require('./backboneRouter.js');
var popsicle = require('popsicle');

var LoginView = Backbone.View.extend({
  template: loginTemplate,

  events: {
    'click #login': 'login',
    'click #signUp': 'signUp'
  },

  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'show', 'hide', 'login', 'signUp');
    var self = this;
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
  },

  login: function() {
    var self = this;
    var credentials = {
      username: $('#username').val().trim('string'),
      password: $('#password').val().trim('string')
    };

    popsicle({
      method: 'POST',
      url: '/login',
      body: {
        username: $('#username').val().trim('string'),
        password: $('#password').val().trim('string')
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function completeLogin(res) {
      if(res.status === 200)
        return router.navigate('movies', {trigger: true});

      Backbone.Events.trigger('alert', 'Log in failed!', 'Log in');
    });
  },

  show: function() {
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  signUp: function() {
    router.navigate('register', {trigger: true});
  }
});

module.exports = LoginView;
