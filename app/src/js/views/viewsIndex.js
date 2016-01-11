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
var DocsView = require('./docs.js');

var currentUserId = document.cookie.split('=');

var MovieModel = Backbone.Model.extend({
  urlRoot: '/users/movies'
});

var MovieCollection = Backbone.Collection.extend({
  model: MovieModel,
  url: '/users/movies',

  parse: function(response) {
    return response.data;
  }
});

var Movies = new MovieCollection();

var UserModel = Backbone.Model.extend({
  url: '/users',
  parse: function(response) {
    return response.data;
  }
});

var User = new UserModel();

var loginView = new LoginView();
var userView = new UserView({
    cookieId: currentUserId[1],
    model: User
  });
var moviesView = new MovieView({
    cookieId: currentUserId[1],
    collection: Movies
  });
var editView = new EditView({
    cookieId: currentUserId[1],
    collection: Movies
  });
var addView = new AddView({
    movieModel: MovieModel,
    userId: currentUserId[1]
  });
var alertView = new AlertView();
var registerView = new RegisterView();
var promptView = new PromptView();
var userDetailsView = new UserDetailsView({
    model: User
  });
var confirmView = new ConfirmView();
var userInfoView = new UserInfoView({
    model: User
  });
var docsView = new DocsView();

module.exports = {
  Movies: Movies,
  User: User,
  loginView: loginView,
  userView: userView,
  moviesView: moviesView,
  editView: editView,
  addView: addView,
  alertView: alertView,
  registerView: registerView,
  promptView: promptView,
  userDetailsView: userDetailsView,
  confirmView: confirmView,
  userInfoView: userInfoView,
  docsView: docsView
};
