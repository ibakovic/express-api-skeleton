'use strict';

var $ = require('jquery');
window.$ = window.jQuery = require('jquery');
require('bootstrap');
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
  //////////////////////////////////// Render views
  var $body = $('body');

  _.map(views, function(view) {
    view.render();
    $body.append(view.$el);
    view.hide();
  });

  /////////////////////////////Rerouting

  router.on('route:loginPage', function() {
    if(document.cookie) {
      router.navigate('movies', {trigger: true});
      return;
    }

    _.map(views, hideView);

    views.loginView.show();
  });

  router.on('route:openRegister', function() {
    if(document.cookie) {
      router.navigate('movies', {trigger: true});
      return;
    }

    _.map(views, hideView);

    views.registerView.show();
  });

  router.on('route:confirmRegister', function(verId) {
    if(document.cookie) {
      router.navigate('movies', {trigger: true});
      return;
    }

    _.map(views, hideView);

    views.confirmView.getVerId(verId);
    views.confirmView.render();
    views.confirmView.show();
  });

  router.on('route:startApp', function() {
    if(!document.cookie) {
      router.navigate('', {trigger: true});
      return;
    }

    _.map(views, hideView);

    views.moviesView.show();

    views.userView.show();
  });

  router.on('route:returnToLogin', function(redirect) {
    document.location = redirect;
  });

  router.on('route:updateMovieTitle', function(movieId) {
    if(!document.cookie) {
      router.navigate('', {trigger: true});
      return;
    }

    _.map(views, hideView);

    views.editView.getMovieId(movieId);
    views.editView.show();


    views.userView.show();
  });

  router.on('route:addMovie', function() {
    if(!document.cookie) {
      router.navigate('', {trigger: true});
      return;
    }

    _.map(views, hideView);

    views.userView.show();
    views.addView.show();
  });

  router.on('route:getUserDetails', function(userId) {
    if(!document.cookie) {
      router.navigate('', {trigger: true});
      return;
    }

    _.map(views, hideView);

    views.userView.show();
    views.userDetailsView.show();
  });

  router.on('route:userInfo', function(userId) {
    if(!document.cookie) {
      router.navigate('', {trigger: true});
      return;
    }

    _.map(views, hideView);

    views.userView.show();
    views.userInfoView.show();
  });

  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});
