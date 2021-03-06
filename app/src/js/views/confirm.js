var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var popsicle = require('popsicle');
var confirmedRegistrationTemplate = require('../../templates/confirmedRegistration.hbs');

var ConfirmView = Backbone.View.extend({
  template: confirmedRegistrationTemplate,

  events: {
    'click #returnToLogin': 'returnToLogin'
  },

  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'show', 'hide', 'getVerId', 'returnToLogin');
  },

  getCredentials: function(username, password, model) {
    this.credentials = {
      username: username,
      password: password,
      model: model
    };
  },

  getVerId: function(verId) {
    this.verId = verId;
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

  returnToLogin: function() {
    var self = this;

    popsicle({
      method: 'POST',
      url: '/email',
      body: {
        verId: self.verId
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function completeConfirm(res) {
      router.navigate('', {trigger: true});
    })
    .catch(function errorConfirm() {
      Backbone.Events.trgger('alert', 'registration failed', 'Registration failed');
    });
  }
});

module.exports = ConfirmView;
