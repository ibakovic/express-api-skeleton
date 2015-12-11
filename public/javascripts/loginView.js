'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var loginTemplate = require('../../templates/loginTemplate.handlebars');
var router = require('./backboneRouter.js');
var AlertView = require('./alertView.js');

var LoginView = Backbone.View.extend({
  events: {
    'click #login': 'login',
    'click #signUp': 'signUp'
  },

  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'login', 'signUp');
    var self = this;

    this.template = loginTemplate();
  },

  render: function() {
    var self = this;
    self.$el.html(self.template);
  },

  login: function() {
    var self = this;
    var credentials = new self.options.model({
      username: $('#username').val().trim('string'),
      password: $('#password').val().trim('string')
    });
    credentials.save(null, {
      success: function(model, response) {
        var alertView = new AlertView({
          el:$('#alertForm'),
          content: $('#alertBox'),
          msg: response.msg,
          remove: true
        });

        alertView.render();
        alertView.$el.show();
        Backbone.Events.trigger('loggedin');
        router.navigate('movies', {trigger: true});
      },
      error: function(model, response) {
        var alertView = new AlertView({
          el:$('#alertForm'),
          content: $('#alertBox'),
          msg: 'Login failed!',
          remove: false
        });

        alertView.render();
        alertView.$el.show();
        //alert('Log in not successful!');
      }
    });
  },

  signUp: function() {
    router.navigate('register', {trigger: true});
  }
});

module.exports = LoginView;
