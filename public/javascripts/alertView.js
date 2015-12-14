'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var alertTemplate = require('../../templates/alertTemplate.handlebars');

var AlertView = Backbone.View.extend({
  template: alertTemplate,

  properties: {},

  events: {
    'click .alertOk': 'alertOk'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'alertOk', 'getMessage');
    this.options = options;
  },

  render: function() {
    var self =this;
    var html = this.template(self.properties);
    this.$el.css({'display': 'block'});
    this.options.content.html(html);
    return this;
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
    return message;
  },

  alertOk: function() {
    this.$el.hide();
  }
});

module.exports = AlertView;
