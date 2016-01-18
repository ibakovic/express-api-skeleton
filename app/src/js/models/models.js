'use strict';

var Backbone = require('backbone');

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

module.exports = {
  Movies: Movies,
  User: User
};
