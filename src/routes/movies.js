'use strict';

var router = require('express').Router();
var Movie = require('../models/Movie.js');
var User = require('../models/User.js');
var _ = require('lodash');
var logger = require('minilog')('moviesRoute');
var message = require('../../strings.json');

/**
 * List all movies
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}   res
 * @param  {Function(req, res, next)} next
 * @return {JSON}        Return list of movies or an error
 */
function getAllMovies(req, res, next) {
  Movie.find({}, function(err, movies) {
    if (err) {
      next(err);
      return;
    }

    var resData = {};
    resData.success = false;

    if (!movies) {
      resData.msg = message.MoviesNotFound;
      res.status(400).json(resData);
      return;
    }

    User.populate(movies, {path: 'addedBy', model: 'User'}, function(err, movie){
      resData.msg = message.MovieFound;
      resData.success = true;
      resData.data = _.invoke(movie, 'toObject');

      res.status(200).json(resData);
    });
  });
}

router
  .get('/', getAllMovies);

module.exports = router;
