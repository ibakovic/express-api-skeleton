'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var alertTemplate = require('../../templates/alert.hbs');

var AlertView = Backbone.View.extend({
  template: alertTemplate,

  properties: {},

  events: {
    'click #closeAlert': 'closeAlert'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'show', 'hide', 'getMessage', 'closeAlert');
  },

  render: function() {
    var self = this;
    var html = this.template(self.properties);
    this.$el.html(html);
    return this;
  },

  show: function() {
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  getMessage: function(message, title) {
    var self = this;
    if(!message) {
      self.properties = {
        message: 'No message to display!',
        title: 'Error!'
      };
    }
    this.properties = {
      message: message,
      title: title
    };

    this.render();

    return message;
  },

  closeAlert: function() {
    this.$el.hide();
  }
});

module.exports = AlertView;
