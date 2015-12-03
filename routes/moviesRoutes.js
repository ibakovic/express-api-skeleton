'use script';

var _ = require('lodash');
var router = require('express').Router();
var Movie = require('../models/movies.js');
var Message = require('../strings.json');
var logger = require('minilog')('moviesRoutes');

/**
 * @typedef ApiResponse
 * @param {String} msg       server message
 * @param {Boolean} success  status flag
 * @param {Object} data      server sent data
 */

/**
 * Creates a query to find a movie with title and addedBy
 */
function createMovieQuery (req) {
  return {
    _id: req.params.movieId,
    addedBy: req.user.id
  };
}

/**
 * Adds a new user movie (handles PUT)
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function addMovie (req, res, next) {
  var resData = {};

  if(!req.body.title) {
    resData.msg = Message.MovieTitleParameterRequired;
    resData.success = false;

    return res.status(400).json(resData);
  }

  var duplicateQuery = {
    title: req.body.title,
    addedBy: req.user.id
  };

  Movie.findOne(duplicateQuery, function(err, duplicatedMovie) {
    if (err)
      return next(err);

    if (duplicatedMovie) {
      resData.msg = Message.MovieDuplicated;
      resData.success = false;
      return res.status(400).json(resData);
    }

    var movie = new Movie({
      title: req.body.title,
      link: req.body.link,
      addedBy: req.user.id
    });

    movie.save(function (err, movie) {
      if (err)
        return next(err);

      resData.msg = Message.MovieAdded;
      resData.success = true;
      resData.data = movie;

      return res.status(200).json(resData);
    });
  });
}

/**
 * Gets all user movies (handles GET)
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function listMovies (req, res, next) {
  var allUserMoviesQuery = { addedBy: req.user.id };
  Movie.find(allUserMoviesQuery, function(err, movies) {
    if (err)
      return next(err);

    var resData = {};
    resData.msg = Message.MoviesPresent;
    resData.success = true;

    if (!movies) {
      resData.msg = Message.MoviesNotFound;
      resData.success = false;
      return res.status(400).json(resData);
    }

    resData.data = _.invoke(movies, 'toObject');

    return res.status(200).json(resData);
  });
}

/**
 * Shows movie description
 * @param  {HTTPRequest}              req                  api request
 * @param  {String}                   req.params.movieId   movie id
 * @param  {HTTPResponse}             res
 * @param  {Function(req, res, next)} next                 next middleware
 * @augments res using ApiResponse format
 */
function showMovie (req, res, next) {
  var movieQuery = {
    addedBy: req.user.id,
    _id: req.params.movieId
  };

  Movie.findOne(movieQuery, function(err, movie) {
    if (err)
      return next(err);

    var status;
    var resData = {};

    if (!movie) {
      resData.msg = Message.MovieNotFound;
      resData.success = false;
      status = 400;

      return res.status(status).json(resData);
    }

    resData.msg = Message.MovieFound;
    resData.success = true;
    resData.data = movie.toObject();
    status = 200;

    return res.status(status).json(resData);
  });
}

/**
 * Deletes a movie (handles DELETE)
 * @param  {HTTPRequest}              req                  api request
 * @param  {String}                   req.params.movieId   movie id
 * @param  {HTTPResponse}             res
 * @param  {Function(req, res, next)} next                 next middleware
 * @augments res using ApiResponse format
 */
function deleteMovie (req, res, next) {
  var resData = {};
  resData.msg = Message.MovieDeleted;
  resData.success = true;

  Movie.findOneAndRemove(createMovieQuery(req), function(err, movie) {
    if (err)
      return next(err);

    if (!movie) {
      resData.msg = Message.MovieNotFound;
      resData.success = false;

      return res.status(400).json(resData);
    }

    return res.status(200).json(resData);
  });
}

/**
 * Updates movies (handles PUT)
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function updateMovie (req, res, next) {
  var resData = {};

  if (!req.body.update) {
    resData.msg = Message.MovieTitleParameterRequired;
    res.success = false;

    return res.status(400).json(resData);
  }

  var duplicateQuery = {
    title: req.body.update,
    addedBy: req.user.id
  };

  Movie.findOne(duplicateQuery, function (err, duplicatedMovie) {
    if (err)
      return next(err);

    if (duplicatedMovie) {
      resData.msg = Message.MovieDuplicated;
      resData.success = false;

      return res.status(400).json(resData);
    }

    var updateQuery = { title: req.body.update };
    Movie.findOneAndUpdate(createMovieQuery(req), updateQuery, {'new': true}, function(err, movie) {
      if (err)
        return next(err);

      if (!movie) {
        resData.msg = Message.MovieNotFound;
        resData.success = false;

        return res.status(400).json(resData);
      }

      resData.data = movie;
      resData.msg = Message.MovieUpdated;
      resData.success = true;

      return res.status(200).json(resData);
    });
  });
}


function isAuthenticate(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    logger.error('error', 'You must be logged in to do that.');
    res.redirect('/login');
  }
}

router
  .use(isAuthenticate)
  .post('/', addMovie)
  .get('/', listMovies)
  .get('/:movieId', showMovie)
  .delete('/:movieId', deleteMovie)
  .put('/:movieId', updateMovie);

module.exports = router;