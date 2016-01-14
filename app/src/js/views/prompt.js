'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var promptTemplate = require('../../templates/prompt.hbs');

var PromptView = Backbone.View.extend({
  template: promptTemplate,

  properties: {},

  events: {
    'click #promptYes': 'promptYes',
    'click .promptNo': 'promptNo'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'show', 'hide', 'getMessage', 'promptYes', 'promptNo');
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

  getMessage: function(message, title, id) {
    var self = this;
    if(!message) {
      self.properties = {
        message: 'No message to display!',
        title: 'Error!',
        id: ''
      };
    }

    this.properties = {
      message: message,
      title: title,
      id: id
    };

    this.render();

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


