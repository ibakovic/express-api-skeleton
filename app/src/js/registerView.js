'use script';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var registerTemplate = require('../../../templates/registerTemplate.handlebars');

var RegisterView = Backbone.View.extend({
  template: registerTemplate,

  events: {
    'click #register': 'register',
    'click #cancelRegister': 'cancelRegister'
  },
  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'register', 'cancelRegister');
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
  },

  register: function() {
    var self = this;
    var userEmail = $('#userEmail').val().trim();

    if(!userEmail)
      return Backbone.Events.trigger('alert', 'E-mail required', 'Registration');

    var username = $('#registerUsername').val().trim();
    var password = $('#registerPassword').val().trim();

    Backbone.Events.trigger('register', username, password, self.options.model);

    this.options.emailModel.fetch({success: function(model, response) {
      Backbone.Events.trigger('alert', 'To confirm registration go to your e-mail and click the link!', 'Registration');
    }});
  },

  cancelRegister: function() {
    router.navigate('', {trigger: true});
  }
});

module.exports = RegisterView;
