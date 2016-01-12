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

function hideView(view) {
  view.hide();
}

$('document').ready(function() {
  var $body = $('body');

  _.map(views, function(view) {
    view.render();
    $body.append(view.$el);
    view.hide();
  });

  /////////////////////////////Rerouting

  router.on('route:loginPage', function() {
    _.map(views, hideView);

    views.loginView.show();
  });

  router.on('route:openRegister', function() {
    _.map(views, hideView);

    views.registerView.show();
  });

  router.on('route:confirmRegister', function(verId) {
    _.map(views, hideView);

    views.confirmView.getVerId(verId);
    views.confirmView.render();
    views.confirmView.show();
  });

  router.on('route:startApp', function() {
    _.map(views, hideView);

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
    _.map(views, hideView);

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
    _.map(views, hideView);

    views.addView.getImgId(imageId);
    views.userView.show();
    views.addView.show();
  });

  router.on('route:getUserDetails', function(userId) {
    _.map(views, hideView);

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
    _.map(views, hideView);

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
