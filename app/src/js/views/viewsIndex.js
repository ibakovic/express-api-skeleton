'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var LoginView = require('./login.js');
var UserMovieView = require('./userMovieCollection.js');
var UserView = require('./user.js');
var EditView = require('./edit.js');
var AddView = require('./add.js');
var RegisterView = require('./register.js');
var AlertView = require('./alert.js');
var PromptView = require('./prompt.js');
var UserDetailsView = require('./userDetails.js');
var ConfirmView = require('./confirm.js');
var UserInfoView = require('./userInfo.js');
var MoviesView = require('./moviesCollection.js');
var models = require('../models/models.js');

var currentUserId = document.cookie.split('=');

var loginView = new LoginView({
  userId: currentUserId[1],
  movieCollection: models.UserMovies,
  userModel: models.User
});

var alertView = new AlertView();

var registerView = new RegisterView();

var promptView = new PromptView();

var confirmView = new ConfirmView();

//////////////////////require User.fetch

var userInfoView = new UserInfoView({
  model: models.User
});

var userDetailsView = new UserDetailsView({
    model: models.User
  });

var userView = new UserView({
  cookieId: currentUserId[1],
  model: models.User
});

/////////////////////////////////////////
////////////Reuire UserMovies.fetch()

var userMoviesView = new UserMovieView({
  cookieId: currentUserId[1],
  collection: models.UserMovies
});

var editView = new EditView({
  cookieId: currentUserId[1],
  collection: models.UserMovies
});

var addView = new AddView({
  userId: currentUserId[1],
  collection: models.UserMovies,
  model: models.UserMovieModel
});

//////////////////////////////////////////
////////////////

var moviesView = new MoviesView({
  userId: currentUserId[1],
  collection: models.Movies
});

module.exports = {
  loginView: loginView,
  userView: userView,
  moviesView: moviesView,
  userMoviesView: userMoviesView,
  editView: editView,
  addView: addView,
  registerView: registerView,
  promptView: promptView,
  userDetailsView: userDetailsView,
  confirmView: confirmView,
  userInfoView: userInfoView,
  alertView: alertView
};
