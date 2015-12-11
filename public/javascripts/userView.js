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
    _.bindAll(this, 'render', 'getUserInfo', 'hideUserInfo', 'updatePassword', 'logout', 'deleteUser');

    self.template = getInfoTemplate();

    self.listenTo(self.model, 'change', self.render(getInfoTemplate()));
  },

  render: function() {
    var self = this;
    $(self.el).html(self.template);
  },

  getUserInfo: function() {
    var self = this;

    var template = usersTemplate({
      username: self.options.model.get('username'),
      userId: self.options.model.get('id')
    });

    self.template = template;

    self.render();
  },

  hideUserInfo: function() {
    this.template = getInfoTemplate();
    this.render();
  },

  updatePassword: function(htmlElement) {
    var self = this;
    var updatedPassword = $(htmlElement.currentTarget).siblings('#updatePasswordText').val().trim('string');

    console.log('update password', updatedPassword);

    var user = self.options.model;

    user.set({
      update: updatedPassword
    });
    user.save(null, {
      success: function(model, response) {
        alert(response.msg);
      },
      error: function(model, response) {
        alert(response.msg);
        self.collection.set(model);
      }
    });
  },

  logout: function() {
    var logOut = new LogoutModel();

    logOut.fetch({
      success: function(model, res, opt) {
        alert('Success', res.msg);
        router.navigate('login' + res.redirect, {trigger: true});
      },
      error: function(model, res, opt) {
        alert('Error! ', res);
      }
    });
  },

  deleteUser: function() {
    var self = this;
    var user = self.collection.findWhere({id: self.options.cookieId});
    if(confirm('Are you sure you want to delete your account?')) {
      user.destroy({
        success: function(model, res) {
          alert(res.msg);
          router.navigate('login' + res.redirect, {trigger: true});
        },
        error: function(model, res) {
          alert('Couldn\'t delete your account');
        }
      });
    }
  }
});

module.exports = UserView;
