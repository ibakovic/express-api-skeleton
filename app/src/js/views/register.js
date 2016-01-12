'use script';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var popsicle = require('popsicle');
var registerTemplate = require('../../templates/register.hbs');

var RegisterView = Backbone.View.extend({
  template: registerTemplate,

  events: {
    'click #register': 'register',
    'click #cancelRegister': 'cancelRegister'
  },
  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'show', 'hide', 'register', 'cancelRegister');
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
  },

  register: function() {
    var self = this;
    var credentials = ({
      username: $('#registerUsername').val().trim(),
      password: $('#registerPassword').val().trim(),
      emailTo: $('#userEmail').val().trim()
    });

    popsicle({
      method: 'POST',
      url: '/register',
      body: {
        username: $('#registerUsername').val().trim(),
        password: $('#registerPassword').val().trim(),
        emailTo: $('#userEmail').val().trim()
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function completeRegister(res) {
      Backbone.Events.trigger('alert', res.msg, 'Registration');
      router.navigate('', {trigger: true});
    })
    .catch(function errorConfirm() {
      Backbone.Events.trigger('alert', 'Registration failed', 'Registration');
    });
  },

  show: function() {
    this.$el.show();
  },

  hide: function() {
    $('#registerPassword').val('');
    this.$el.hide();
  },

  cancelRegister: function() {
    router.navigate('', {trigger: true});
  }
});

module.exports = RegisterView;
