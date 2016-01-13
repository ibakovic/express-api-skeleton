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
    _.bindAll(this, 'render', 'validateEmail', 'show', 'hide', 'register', 'cancelRegister');
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
  },

  validateEmail: function (emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
  },

  register: function() {
    var username = $('#registerUsername').val().trim();
    var password = $('#registerPassword').val().trim();
    var email = $('#userEmail').val().trim();
    var self = this;

    if(!this.validateEmail(email)) {
      Backbone.Events.trigger('alert', 'Incorrect e-mail form!', 'Register error');
      return;
    }

    if(username === '' || password === '') {
      Backbone.Events.trigger('alert', 'Username and password required!', 'Registration error');
      return;
    }

    var credentials = ({
      username: username,
      password: password,
      emailTo: email
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
      Backbone.Events.trigger('alert', 'Registration failed', 'Registration error');
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
