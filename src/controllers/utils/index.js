'use strict';
<<<<<<< HEAD
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
=======

module.exports = {
  status: require('./status'),
  catch404: require('./catch404')
};
>>>>>>> 11d6117c75cf352a979c864a77f07de975ac605f
