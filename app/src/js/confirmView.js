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
    _.bindAll(this, 'render', 'getVerId', 'returnToLogin');
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

  returnToLogin: function() {
    var self = this;
    var verification = new this.options.model({verId: self.verId});

    verification.save(null, {success: function(model, response) {
      router.navigate('', {trigger: true});
    }});
  }
});

module.exports = ConfirmView;
