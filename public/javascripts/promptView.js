'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var promptTemplate = require('../../templates/promptTemplate.handlebars');

var PromptView = Backbone.View.extend({
  events: {
    'click #promptYes': 'promptYes',
    'click .promptNo': 'promptNo'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'getMessage', 'promptYes', 'promptNo');
    this.options = options;
    this.template = promptTemplate({message : 'Init'});
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
      self.template = promptTemplate({
        message: 'No message to display!',
        title: 'Error!'
      });
    }
    this.template = promptTemplate({
      message: message,
      title: title
    });
    return message;
  },

  promptYes: function() {
    Backbone.Events.trigger('prompt:confirm', true);
    this.$el.hide();
  },

  promptNo: function() {
    Backbone.Events.trigger('prompt:confirm', false);
    this.$el.hide();
  }
});

module.exports = PromptView;


