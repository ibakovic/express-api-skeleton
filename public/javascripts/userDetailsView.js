'use script';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var router = require('./backboneRouter.js');
var userDetailsTemplate = require('../../templates/userDetailsTemplate.handlebars');

var userDetailsView = Backbone.View.extend({
  events: {
    'click #updatePassword': 'updatePassword',
    'click #deleteUser': 'deleteUser'
  },

  template: userDetailsTemplate,

  initialize: function(options) {
    var self = this;
    _.bindAll(this, 'render', 'updatePassword', 'deleteUser');
    this.options = options;

    console.log('init details', self.options.model);
    // this.template = userDetailsTemplate({
    //   username: self.options.model.get('username'),
    //   userId: self.options.model.get('id')
    // });
  },

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    return this.$el;
  },

  getUserId: function(userId) {
    this.userId = userId;
  },

  updatePassword: function(htmlElement) {
    var self = this;
    var updatedPassword = $('#updatePasswordText').val().trim('string');

    var user = self.options.model;

    user.set({
      update: updatedPassword
    });
    user.save(null, {
      success: function(model, response) {
        Backbone.Events.trigger('alert', response.msg, 'Change password');
      },
      error: function(model, response) {
        Backbone.Events.trigger('alert', response.msg, 'Change password');
        self.collection.set(model);
      }
    });
  },

  deleteUser: function() {
    var self = this;
    var user = self.options.model;

    Backbone.Events.trigger('prompt', 'Are you sure you want to remove your account?', 'Delete account');
    Backbone.Events.on('prompt:confirm', function(confirm) {
      if(confirm) {
        user.destroy();
        router.navigate('', {trigger: true});
      }
    });
  }
});

module.exports = userDetailsView;
