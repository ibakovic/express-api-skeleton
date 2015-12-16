'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var router = require('./backboneRouter.js');
var userNavbarTemplate = require('../../../templates/userNavbarTemplate.handlebars');

var LogoutModel = Backbone.Model.extend({
  url: '/logout'
});

var UserView = Backbone.View.extend({
  template: userNavbarTemplate,

  events: {
    'click #getUserInfo': 'getUserInfo',
    'click #addMovieButton': 'openAddMovieForm',
    'click #logout': 'logout'
  },

  initialize: function(options) {
    var self = this;
    this.options = options;
    _.bindAll(this, 'render', 'getUserInfo', 'openAddMovieForm', 'logout');

    this.listenTo(self.model, 'change', self.render);
  },

  render: function() {
    var html = this.template(this.options.model.toJSON());
    this.$el.html(html);
  },

  getUserInfo: function() {
    var self = this;

    router.navigate('userDetails/' + self.options.model.get('id'), {trigger: true});
  },

  openAddMovieForm: function() {
    router.navigate('addMovie', {trigger: true});
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