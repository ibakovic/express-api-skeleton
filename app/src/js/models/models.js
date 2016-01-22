'use strict';

var Backbone = require('backbone');

var MovieModel = Backbone.Model.extend({});

var MovieCollection = Backbone.Collection.extend({
  model: MovieModel,
  url: '/movies',

  parse: function(response) {
    return response.data;
  }
});

var Movies = new MovieCollection();

var UserMovieModel = Backbone.Model.extend({
  urlRoot: '/users/movies'
});

var UserMovieCollection = Backbone.Collection.extend({
  model: UserMovieModel,
  url: '/users/movies',

  parse: function(response) {
    return response.data;
  }
});

var UserMovies = new UserMovieCollection();

var UserModel = Backbone.Model.extend({
  url: '/users',
  parse: function(response) {
    return response.data;
  }
});

var User = new UserModel();

Movies.fetch({reset: true});

if(document.cookie) {
  UserMovies.fetch({reset: true});
  User.fetch();
}

module.exports = {
  UserMovies: UserMovies,
  User: User,
  UserMovieModel: UserMovieModel,
  Movies: Movies
};
