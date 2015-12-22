'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('lodash');
var router = require('./backboneRouter.js');
var popsicle = require('popsicle');
var uploadimageTemplate = require('../../../templates/uploadImageTemplate.handlebars');

var UploadImageView = Backbone.View.extend({
  template: uploadimageTemplate,
  events: {
    'click #uploadImage': 'uploadImage'
  },
  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render', 'uploadImage');
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);
  },

  uploadImage: function() {
    /*popsicle({
      method: 'POST',
      url: 'users/movies/upload'
    })
    .then(function successUpload(res) {
      if(res.status === 200) {
        this.$el.hide();
        router.navigate('addMovie', {trigger: true});
      }

      Backbone.Events.trigger('alert', 'Failed to upload your image');
    });*/
    this.$el.hide();
    router.navigate('addMovie', {trigger: true});
  }
});

module.exports = UploadImageView;
