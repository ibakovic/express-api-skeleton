'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var loginTemplate = require('../../templates/loginTemplate.handlebars');
var Router = require('./backboneRouter.js');

var router = new Router();

var LoginModel = Backbone.Model.extend({
  url: '/login'
});

var LoginCollection = Backbone.Collection.extend({
  model: LoginModel
});

var RegisterModel = Backbone.Model.extend({
  url: '/register'
});

var Login = new LoginCollection();

var LoginView = Backbone.View.extend({
  events: {
    'click #login': 'login',
    'click #register': 'register'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'login', 'register');
    var self = this;

    this.render(loginTemplate());
  },

  render: function(content) {
    var self = this;
    $(self.el).html(content);
  },

  login: function() {
    var self = this;
    var credentials = new LoginModel({
      username: $('#username').val().trim('string'),
      password: $('#password').val().trim('string')
    });
    credentials.save(null, {
      success: function(model, response) {
        alert(response.msg);
        router.navigate('movies', true);
      },
      error: function() {
        alert('Log in not successful!');
      }
    });
  },

  register: function() {
    var self = this;
    var credentials = new RegisterModel({
      username: $('#username').val().trim('string'),
      password: $('#password').val().trim('string')
    });

    credentials.save(null, {
      success: function(model, res) {
        alert(res.msg);
      },
      error: function(model, res) {
        alert('Register not successful!');
      }
    });
  }
});

module.exports = LoginView;
