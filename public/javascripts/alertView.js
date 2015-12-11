'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var alertTemplte = require('../../templates/alertTemplate.handlebars');

var AlertView = Backbone.View.extend({
  template: alertTemplte,

  events: {
    'click #alertOk': 'alertOk'
  },

  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'alertOk');
  },

  render: function() {
    var self = this;
    this.$el.css({'display': 'block'});
    this.options.content.html(alertTemplte({message: self.options.msg}));
    return this;
  },

  alertOk: function() {
    var self = this;
    if(self.options.remove)
      return self.remove();

    this.$el.hide();
  }
});

module.exports = AlertView;
