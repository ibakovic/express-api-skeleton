'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var router = require('./backboneRouter.js');
var usersTemplate = require('../../templates/usersTemplate.handlebars');
var getInfoTemplate = require('../../templates/getInfoTemplate.handlebars');

var LogoutModel = Backbone.Model.extend({
  url: '/logout'
});

var UserView = Backbone.View.extend({
  events: {
    'click #getUserInfo': 'getUserInfo',
    'click #hideUserInfo': 'hideUserInfo',
    'click #updatePassword': 'updatePassword',
    'click #logout': 'logout',
    'click #deleteUser': 'deleteUser'
  },

  initialize: function(options) {
    var self = this;
    self.options = options;
    _.bindAll(this, 'render', 'getUserInfo', 'hideUserInfo', 'logout');

    self.template = getInfoTemplate();

    console.log('users view', self.options.model.get('id'));

    self.listenTo(self.model, 'change', self.render(getInfoTemplate()));
  },

  render: function() {
    var self = this;
    $(self.el).html(self.template);
  },

  getUserInfo: function() {
    var self = this;

    router.navigate('userDetails/' + self.options.model.get('id'), {trigger: true});
  },

  hideUserInfo: function() {
    this.template = getInfoTemplate();
    this.render();
  },

  logout: function() {
    var logOut = new LogoutModel();

    logOut.fetch({
      success: function(model, res, opt) {
        Backbone.Events.trigger('alert', 'Logout success!', 'Logout');
        router.navigate('', {trigger: true});
      },
      error: function(model, res, opt) {
        Backbone.Events.trigger('alert', 'Error!' + res, 'Logout');
      }
    });
  }
});

module.exports = UserView;
