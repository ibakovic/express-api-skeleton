/**
  * moviesRoutes.js
  */
'use script';

var router = require('express').Router();
var isAuthenticated = require('../isAuthenticated.js');
var Movie = require('../models/movies.js');
var Message = require('../strings.json');

/**
  * @typedef ApiResponse
  * @param {String} msg       server message
  * @param {Boolean} success  status flag
  * @param {Object} data      server sent data
  */

/**
  * Creates a query to find a movie with title and username
  */
function createMovieQuery (req) {
  return {
    title: req.params.movieId,
    user:  req.user.username
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
    resData.msg = Message.MovieTitleEmpty;
    resData.success = false;

    res.status(400).json(resData);
  }

  var duplicateQuery = {
    title: req.body.title,
    user:  req.user.username
  };

  Movie.findOne(duplicateQuery, function(err, duplicatedMovie) {
    if (err)
      return next(err);

    if (duplicatedMovie) {
      resData.msg = Message.MovieDuplicated;
      resData.success = false;
      return res.status(400).json(resData);
    }

    var saveQuery = new Movie({
      title: req.body.title,
      link: req.body.link,
      user: req.user.username
    });

    saveQuery.save(function (err, movie) {
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
  *
  * @param  {HttpRequest} req
  * @param  {HttpResponse} res
  * @param  {Function(req, res, next)} next
  * @augments res using ApiResponse format
  */
function listMovies (req, res, next) {
  var allUserMoviesQuery = { user: req.user.username };
  Movie.find(allUserMoviesQuery, function(err, movies) {
    if (err)
      return next(err);

    var resData = {};
    resData.msg = Message.MoviesReady;
    resData.success = true;

    if (!movies) {
      resData.msg = Message.MoviesNotFound;
      resData.success = false;
      return res.status(400).json(resData);
    }

    resData.data = movies;
    return res.status(200).json(resData);
  });
}

function showMovie (req, res, next) {
  Movie.findOne(createMovieQuery(req), function (err, movie) {
    if (err)
      return next();

    var resData = {};
    resData.msg = Message.MovieFound;
    resData.success = true;

    if (!movie) {
      resData.msg = Message.MovieNotFound;
      resData.success = false;
      return res.status(400).json(resData);
    }

    resData.data = movie;
    return res.status(200).json(resData);
  });
}

/**
  * Deletes a movie (handles DELETE)
  *
  * @param  {HttpRequest} req
  * @param  {HttpResponse} res
  * @param  {Function(req, res, next)} next
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
    resData.msg = Message.MovieTitleUpdateRequired;
    res.success = false;

    return res.status(400).json(resData);
  }

  var duplcateQuery = {
    title: req.body.update,
    user: req.user.username
  };
  Movie.findOne(duplcateQuery, function (err, duplicatedMovie) {
    if (err)
      return next(err);

    if (duplicatedMovie) {
      resData.msg = Message.MovieDuplicated;
      resData.success = false;

      return res.status(status).json(resData);
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

router
  .use(isAuthenticated())
  .post('/',       addMovie)     // C
  .get('/',      listMovies)
  .get('/:movieId',    showMovie)    // R
  .delete('/:movieId', deleteMovie)  // D
  .put('/:movieId',  updateMovie); // U

module.exports = router;
