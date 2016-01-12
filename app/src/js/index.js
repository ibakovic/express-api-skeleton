'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./views/backboneRouter.js');
var views = require('./views/viewsIndex.js');
var models = require('./models/models.js');

Backbone.Events.on('prompt', function(message, title, id) {
  views.promptView.getMessage(message, title, id);
  views.promptView.show();
});

Backbone.Events.on('alert', function(message, title) {
  views.alertView.getMessage(message, title);
  views.alertView.show();
});

Backbone.Events.on('movie:add', function(model) {
  views.moviesView.appendItem(model);
});

$('document').ready(function() {
  var $body = $('body');

  for(var view in views) {
    views[view].render();
    $body.append(views[view].$el);
    views[view].hide();
  }

  /////////////////////////////Rerouting

  router.on('route:loginPage', function() {
    for(var view in views)
      views[view].hide();

    views.loginView.show();
  });

  router.on('route:openRegister', function() {
    for(var view in views)
      views[view].hide();

    views.registerView.show();
  });

  router.on('route:confirmRegister', function(verId) {
    for(var view in views)
      views[view].hide();

    views.confirmView.getVerId(verId);
    views.confirmView.render();
    views.confirmView.show();
  });

  router.on('route:startApp', function() {
    for(var view in views)
      views[view].hide();

    models.Movies.fetch({success: function(collection, response) {
      views.moviesView.show();
      models.User.fetch({success: function(collection, response) {
        views.userView.show();
      }});
    }});

  });

  router.on('route:returnToLogin', function(redirect) {
    document.location = redirect;
  });

  router.on('route:updateMovieTitle', function(movieId) {
    for(var view in views)
      views[view].hide();

    if(models.Movies.length === 0) {
      models.Movies.fetch({success: function(collection, response) {
        views.userView.show();
        views.editView.getMovieId(movieId);
        views.editView.show();
        return;
      }});
    }

    views.editView.getMovieId(movieId);
    views.editView.show();
  });

  router.on('route:addMovie', function(imageId) {
    for(var view in views)
      views[view].hide();

    views.addView.getImgId(imageId);
    views.userView.show();
    views.addView.show();
  });

  router.on('route:getUserDetails', function(userId) {
    for(var view in views)
      views[view].hide();

    if(!models.User.get('username')) {
      models.User.fetch({success: function(model, response) {
        views.userView.show();
        views.userDetailsView.show();
        return;
      }});
    }

    views.userView.show();
    views.userDetailsView.show();
  });

  router.on('route:userInfo', function(userId) {
    for(var view in views)
      views[view].hide();

    if(!models.User.get('username')) {
      models.User.fetch({success: function(model, response) {
        views.userView.show();
        views.userInfoView.show();
        return;
      }});
    }

    views.userView.show();
    views.userInfoView.show();
  });

  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});
