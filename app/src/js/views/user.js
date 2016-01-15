'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var popsicle = require('popsicle');
var userNavbarTemplate = require('../../templates/userNavbar.hbs');

var UserView = Backbone.View.extend({
  template: userNavbarTemplate,

  events: {
    'click #getUserInfo': 'getUserInfo',
    'click #addMovieButton': 'openAddMovieForm',
    'click #logout': 'logout',
    'click #homePage': 'homePage',
    'click #openDocs': 'openDocs'
  },

  initialize: function(options) {
    var self = this;
    this.options = options;
    _.bindAll(this, 'render', 'show', 'hide', 'getUserInfo', 'openAddMovieForm', 'logout', 'homePage', 'openDocs');

    this.listenTo(self.model, 'change', self.render);
  },

  render: function() {
    var html = this.template(this.options.model.toJSON());
    this.$el.html(html);
  },

  show: function() {
    this.render();
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  getUserInfo: function() {
    var self = this;

    router.navigate('userDetails/' + self.options.model.get('id'), {trigger: true});
  },

  openAddMovieForm: function() {
    router.navigate('addMovie', {trigger: true});
  },

  logout: function() {
    var self = this;

    popsicle({
      method: 'GET',
      url: '/logout',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function logoutSuccess(res) {
      document.cookie = 'user=' + self.options.model.get('id') + '; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      Backbone.Events.trigger('alert', 'Logout success!', 'Logout');
      router.navigate('', {trigger: true});
    })
    .catch(function logoutFailure(res) {
      Backbone.Events.trigger('alert', 'Error!' + res, 'Logout');
    });
  },

  homePage: function() {
    router.navigate('movies', {trigger: true});
  },

  openDocs: function() {
    //redirect to docs
    window.open('/docs');
  }
});

module.exports = UserView;
