'use strict';
var users = require('./users');
var userId = require('./userId');
var userMovies = require('./userMovies');
var userMoviesId = require('./userMoviesId');

module.exports = {
  register: users.register,
  getAllUsers: users.getAllUsers,
  updateUser: userId.updateUser,
  logIn: userId.logIn,
  deleteUser: userId.deleteUser,
  getUser: userId.getUser,
  addMovie: userMovies.addMovie,
  getAllUserMovies: userMovies.getAllUserMovies,
  updateMovie: userMoviesId.updateMovie,
  getUserMovie: userMoviesId.getUserMovie,
  deleteMovie: userMoviesId.deleteMovie,
  getAllMovies: require('./getAllMovies')
};