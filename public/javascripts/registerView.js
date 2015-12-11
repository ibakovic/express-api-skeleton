'use script';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var router = require('./backboneRouter.js');
var registerTemplate = require('../../templates/registerTemplate.handlebars');

var RegisterView = Backbone.View.extend({
  events: {
    'click #register': 'register',
    'click #cancelRegister': 'cancelRegister'
  },
  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'register', 'cancelRegister');
    this.template = registerTemplate();
  },

  render: function() {
    var self = this;
    this.$el.html(self.template);
  },

  register: function() {
    var self = this;
    var credentials = new self.options.model({
      username: $('#registerUsername').val().trim('string'),
      password: $('#registerPassword').val().trim('string')
    });

    credentials.save(null, {
      success: function(model, res) {
        Backbone.Events.trigger('alert', res.msg, 'Registration');
        router.navigate('', {trigger: true});
      },
      error: function(model, res) {
        Backbone.Events.trigger('alert', 'Registration failed', 'Registration');
      }
    });
  },

  cancelRegister: function() {
    router.navigate('', {trigger: true});
  }
});

module.exports = RegisterView;
