'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var LoginView = require('./login.js');
var MovieView = require('./movieCollection.js');
var UserView = require('./user.js');
var EditView = require('./edit.js');
var AddView = require('./add.js');
var RegisterView = require('./register.js');
var AlertView = require('./alert.js');
var PromptView = require('./prompt.js');
var UserDetailsView = require('./userDetails.js');
var ConfirmView = require('./confirm.js');
var UserInfoView = require('./userInfo.js');
var models = require('../models/models.js');

var currentUserId = document.cookie.split('=');

var loginView = new LoginView({
  userId: currentUserId[1]
});

var alertView = new AlertView();

var addView = new AddView({
  userId: currentUserId[1]
});

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
////////////Reuire Movies.fetch()

var moviesView = new MovieView({
  cookieId: currentUserId[1],
  collection: models.Movies
});

var editView = new EditView({
  cookieId: currentUserId[1],
  collection: models.Movies
});

module.exports = {
  loginView: loginView,
  userView: userView,
  moviesView: moviesView,
  editView: editView,
  addView: addView,
  registerView: registerView,
  promptView: promptView,
  userDetailsView: userDetailsView,
  confirmView: confirmView,
  userInfoView: userInfoView,
  alertView: alertView
};
