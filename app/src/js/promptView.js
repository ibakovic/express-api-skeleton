'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var promptTemplate = require('../../../templates/promptTemplate.handlebars');

var PromptView = Backbone.View.extend({
  template: promptTemplate,

  properties: {},

  events: {
    'click #promptYes': 'promptYes',
    'click .promptNo': 'promptNo'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'getMessage', 'promptYes', 'promptNo');
    this.options = options;
  },

  render: function() {
    var html = this.template(this.properties);
    this.$el.css({'display': 'block'});
    this.options.content.html(html);
    return this;
  },

  getMessage: function(message, title, id) {
    var self = this;
    if(!message) {
      self.properties = {
        message: 'No message to display!',
        title: 'Error!'
      };
    }
    this.properties = {
      message: message,
      title: title,
      id: id
    };
    return message;
  },

  promptYes: function() {
    var self = this;
    Backbone.Events.trigger('prompt:confirm:' + self.properties.id, true);
    this.$el.hide();
  },

  promptNo: function() {
    var self = this;
    Backbone.Events.trigger('prompt:confirm:' + self.properties.id, false);
    this.$el.hide();
  }
});

module.exports = PromptView;


