var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var router = require('./views/backboneRouter.js');
var views = require('./views/viewsIndex.js');

Backbone.Events.on('prompt', function(message, title, id) {
  views.promptView.getMessage(message, title, id);
  views.promptView.render();
  $('body').append(views.promptView.$el);
  views.promptView.show();
});

Backbone.Events.on('alert', function(message, title) {
  views.alertView.getMessage(message, title);
  views.alertView.render();
  $('body').append(views.alertView.$el);
  views.alertView.show();
});

Backbone.Events.on('movie:add', function(model) {
  views.moviesView.appendItem(model);
});

$('document').ready(function() {
  views.registerView.render();
  $('body').append(views.registerView.$el);
  views.registerView.hide();

  views.loginView.render();
  $('body').append(views.loginView.$el);
  views.loginView.hide();

  views.userView.render();
  $('body').append(views.userView.$el);
  views.userView.hide();

  views.addView.render();
  $('body').append(views.addView.$el);
  views.addView.hide();

  views.editView.render();
  $('body').append(views.editView.$el);
  views.editView.hide();

  views.confirmView.render();
  $('body').append(views.confirmView.$el);
  views.confirmView.hide();

  /////////////////////////////Rerouting

  router.on('route:loginPage', function() {
    views.moviesView.hide();
    views.userView.hide();
    views.addView.hide();
    views.editView.hide();
    views.registerView.hide();
    views.userDetailsView.hide();
    views.alertView.hide();
    views.confirmView.hide();
    views.userInfoView.hide();

    views.loginView.show();
  });

  router.on('route:openRegister', function() {
    views.moviesView.hide();
    views.userView.hide();
    views.addView.hide();
    views.editView.hide();
    views.loginView.hide();
    views.userDetailsView.hide();
    views.alertView.hide();
    views.confirmView.hide();
    views.userInfoView.hide();

    views.registerView.show();
  });

  router.on('route:confirmRegister', function(verId) {
    views.moviesView.hide();
    views.userView.hide();
    views.addView.hide();
    views.editView.hide();
    views.loginView.hide();
    views.userDetailsView.hide();
    views.alertView.hide();
    views.registerView.hide();
    views.userInfoView.hide();

    views.confirmView.getVerId(verId);
    views.confirmView.render();
    views.confirmView.show();
  });

  router.on('route:startApp', function() {
    views.loginView.hide();
    views.editView.hide();
    views.addView.hide();
    views.registerView.hide();
    views.userDetailsView.hide();
    views.alertView.hide();
    views.confirmView.hide();
    views.userInfoView.hide();

    views.Movies.fetch({success: function(collection, response) {
      views.moviesView.render();
      $('body').append(views.moviesView.$el);
      views.moviesView.show();
      views.User.fetch({success: function(collection, response) {
        views.userView.show();
      }});
    }});

  });

  router.on('route:returnToLogin', function(redirect) {
    document.location = redirect;
  });

  router.on('route:updateMovieTitle', function(movieId) {
    views.moviesView.hide();
    views.addView.hide();
    views.loginView.hide();
    views.registerView.hide();
    views.userDetailsView.hide();
    views.alertView.hide();
    views.confirmView.hide();
    views.userInfoView.hide();

    if(views.Movies.length === 0) {
      views.Movies.fetch({success: function(collection, response) {
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
    views.moviesView.hide();
    views.loginView.hide();
    views.editView.hide();
    views.registerView.hide();
    views.userDetailsView.hide();
    views.alertView.hide();
    views.confirmView.hide();
    views.userInfoView.hide();

    views.addView.getImgId(imageId);
    views.userView.show();
    views.addView.show();
  });

  router.on('route:getUserDetails', function(userId) {
    views.moviesView.hide();
    views.loginView.hide();
    views.editView.hide();
    views.registerView.hide();
    views.addView.hide();
    views.alertView.hide();
    views.confirmView.hide();
    views.userInfoView.hide();

    if(!views.User.get('username')) {
      views.User.fetch({success: function(model, response) {
        views.userView.show();
        views.userDetailsView.render();
        $('body').append(views.userDetailsView.$el);
        views.userDetailsView.show();
        return;
      }});
    }

    views.userDetailsView.render();
    $('body').append(views.userDetailsView.$el);
    views.userView.show();
    views.userDetailsView.show();
  });

  router.on('route:userInfo', function(userId) {
    views.moviesView.hide();
    views.loginView.hide();
    views.editView.hide();
    views.registerView.hide();
    views.addView.hide();
    views.alertView.hide();
    views.confirmView.hide();
    views.userDetailsView.hide();

    if(!views.User.get('username')) {
      views.User.fetch({success: function(model, response) {
        views.userView.show();
        views.userInfoView.render();
        $('body').append(views.userInfoView.$el);
        views.userInfoView.show();
        return;
      }});
    }

    views.userInfoView.render();
    $('body').append(views.userInfoView.$el);
    views.userView.show();
    views.userInfoView.show();
  });

  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});
