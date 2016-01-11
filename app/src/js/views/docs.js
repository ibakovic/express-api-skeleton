'use strict';

var Backbone = require('backbone');
var _ = require('lodash');
var $ = require('jquery');
var router = require('./backboneRouter.js');
var popsicle = require('popsicle');

var DocsView = Backbone.View.extend({
  events: {
    'click #closeDocs': 'closeDocs'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'show', 'hide', 'closeDocs');
  },

  render: function() {
    var self = this;

    popsicle({
      method: 'GET',
      url: '/docs',
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(function getDocs(res) {
      var html = res.body;
      console.log('html: ', html);
      self.$el.html(html);
    })
    .catch(function errDocs() {
      Backbone.Events.trigger('alert', 'Loading docs failed', 'Docs');
    });
  },

  show: function() {
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  closeDocs: function() {
    router.navigate('movies', {trigger: true});
  }
});

module.exports = DocsView;
