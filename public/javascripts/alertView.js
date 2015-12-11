'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var alertTemplate = require('../../templates/alertTemplate.handlebars');

var AlertView = Backbone.View.extend({
  events: {
    'click .alertOk': 'alertOk'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'alertOk', 'getMessage');
    this.options = options;
    this.template = alertTemplate({message : 'Init'});
  },

  render: function() {
    var self = this;
    this.$el.css({'display': 'block'});
    this.options.content.html(self.template);
    return this;
  },

  getMessage: function(message, title) {
    var self = this;
    if(!message) {
      self.template = alertTemplate({
        message: 'No message to display!',
        title: 'Error!'
      });
    }
    this.template = alertTemplate({
      message: message,
      title: title
    });
    return message;
  },

  alertOk: function() {
    this.$el.hide();
  }
});

module.exports = AlertView;
