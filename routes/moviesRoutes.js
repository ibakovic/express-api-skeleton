'use script';

var _ = require('lodash');
var router = require('express').Router();
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: __dirname + 'uploads/' });
var Path = require('path');
var mkdirp = require('mkdirp');
var Movie = require('../models/movies.js');
var User = require('../models/users.js');
var MongoImage = require('../models/mongoImages.js');
var Message = require('../strings.json');
var format = require('string-template');
var logger = require('minilog')('moviesRoutes');

var cpUpload = upload.fields([{
  name: 'image',
  maxCount: 1,
  filename: 'image.png',
  destination: __dirname + '/uploads'
}]);

/**
 * Gets current date
 * @return {String} Date in String format
 */
function getDate() {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return format('{day}. {month}. {year}.', {
    day: day,
    month: month,
    year: year
  });
}

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
  logger.log('req.body', req.body);

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
      addedBy: req.user.id,
      created: getDate()
    });
/*
    movie.save(function (err, movie) {
      if (err)
        return next(err);

      resData.msg = Message.MovieAdded;
      resData.success = true;
      resData.data = movie;

      var imageQuery = {
        imageUrl: req.body.imageUrl,
        contentType: 'image/png'
      };
*/
      /*MongoImage.findOne(imageQuery, function(err, img) {
        if(err)
          return next(err);

        if(!img) {
          var newImg = new MongoImage(imageQuery);

          newImg.save(function(err, img) {
            if(err)
              return next(err);
            var path = 'images/' + img.imageUrl;
            mkdirp(Path.join(__dirname, path), function(err) {
              if(err)
                return next(err);
              fs.appendFile(Path.join(__dirname, path) + '/image.png', req.body.image.toString(), null, function(err) {
                if(err)
                  return next(err);
                res.status(200).json(resData);
              });
            });
          });
        }
      });
    });*/
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

    User.populate(movies, {path: 'addedBy', model: 'User'}, function(err, movie){
      logger.log('161', movie.addedBy);

      resData.msg = Message.MovieFound;
      resData.success = true;
      resData.data = _.invoke(movie, 'toObject');
      status = 200;

      return res.status(status).json(resData);
    });
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

    User.populate(movie, {path: 'addedBy', model: 'User'}, function(err, movie){
      logger.log('203', movie.addedBy);

      resData.msg = Message.MovieFound;
      resData.success = true;
      resData.data = movie.toObject();
      status = 200;

      return res.status(status).json(resData);
    });
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

function uploadImage(req, res, next){
  logger.log('req.files', req.file);
  fs.readFile(req.file.path, function (err, data) {
    if(err)
      return next(err);
    var newPath = __dirname + "/uploads";
    mkdirp(newPath, function(err) {
      if(err)
        return next(err);
      fs.appendFile(newPath + '/image.png', data, function (err) {
        if(err)
          return next(err);
        res.redirect("/#addMovie");
      });
    });
  });
}


function isAuthenticate(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    logger.error('error', 'You must be logged in to do that.');
    res.redirect('');
  }
}

router
  .use(isAuthenticate)
  .post('/', addMovie)
  .post('/upload', upload.single('image'), uploadImage)
  .get('/', listMovies)
  .get('/:movieId', showMovie)
  .delete('/:movieId', deleteMovie)
  .put('/:movieId', updateMovie);

module.exports = router;
