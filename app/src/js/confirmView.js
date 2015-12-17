var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var confirmedRegistrationTemplate = require('../../../templates/confirmedRegistrationTemplate.handlebars');

var ConfirmView = Backbone.View.extend({
  template: confirmedRegistrationTemplate,

  events: {
    'click #returnToLogin': 'returnToLogin'
  },

  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'returnToLogin');
  },

  getCredentials: function(username, password, model) {
    this.credentials = {
      username: username,
      password: password,
      model: model
    };
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
    var self = this;
    console.log('render confirm', self.credentials);
    var credentials = new self.credentials.model({
      username: self.credentials.username,
      password: self.credentials.password
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

  returnToLogin: function() {
    router.navigate('', {trigger: true});
  }
});

module.exports = ConfirmView;
