'use script';

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var router = require('./backboneRouter.js');
var userDetailsTemplate = require('../../templates/userDetails.hbs');

var userDetailsView = Backbone.View.extend({
  events: {
    'click #updatePassword': 'updatePassword',
    'click #deleteUser': 'deleteUser',
    'click #hideUserDetails': 'hideUserDetails'
  },

  template: userDetailsTemplate,

  initialize: function(options) {
    var self = this;
    _.bindAll(this, 'render', 'show', 'hide', 'updatePassword', 'deleteUser', 'hideUserDetails');
    this.options = options;
  },

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    return this.$el;
  },

  show: function() {
    this.render();
    this.$el.show();
  },

  hide: function() {
    $('#oldPassword').val('');
    $('#updatePasswordText').val('');
    $('#confirmPassword').val('');
    this.$el.hide();
  },

  getUserId: function(userId) {
    this.userId = userId;
  },

  updatePassword: function(htmlElement) {
    var self = this;
    var oldPassword = $('#oldPassword').val().trim();
    var updatedPassword = $('#updatePasswordText').val().trim();
    var confirmedPassword = $('#confirmPassword').val().trim();

    if(oldPassword === '' || updatedPassword === '' || confirmedPassword === '') {
      Backbone.Events.trigger('alert', 'All password fields must be filled before updating password!', 'Update password error');
      return;
    }

    if(oldPassword === updatedPassword) {
      Backbone.Events.trigger('alert', 'Your new password matches the old one!', 'Update password error');
      return;
    }

    if(updatedPassword !== confirmedPassword)
      return Backbone.Events.trigger('alert', 'New password not confirmed!', 'Password error');

    var user = self.options.model;

    user.set({
      oldPassword: oldPassword,
      update: updatedPassword
    });
    user.save(null, {
      success: function(model, response) {
        Backbone.Events.trigger('alert', response.msg, 'Change password');
      },
      error: function(model, response) {
        Backbone.Events.trigger('alert', response.responseText, 'Change password');
      }
    });
  },

  deleteUser: function() {
    var self = this;
    var user = self.options.model;

    Backbone.Events.trigger('prompt', 'Are you sure you want to remove your account?', 'Delete account', 'deleteUser');
    Backbone.Events.on('prompt:confirm:deleteUser', function(confirm) {
      if(confirm) {
        user.destroy();
        router.navigate('', {trigger: true});
      }
    });
  },

  hideUserDetails: function() {
    router.navigate('movies', {trigger: true});
  }
});

module.exports = userDetailsView;
