'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var router = require('./backboneRouter.js');
var userDetailsTemplate = require('../../../templates/userInfoTemplate.handlebars');

var UserDetailsView = Backbone.View.extend({
  template: userDetailsTemplate,

  events: {
    'click #close': 'close'
  },

  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'close');
  },

  render: function() {
    var self = this;
    var html = this.template({
      userName: self.options.model.get('username'),
      userID: self.options.model.get('id')
    });
    this.$el.html(html);
  },

  close: function() {
    router.navigate('movies', {trigger: true});
  }
});

module.exports = UserDetailsView;
