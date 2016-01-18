'use script';

var _ = require('lodash');
var bCrypt = require('bcrypt-nodejs');
var router = require('express').Router();
var fs = require('fs');
var multer = require('multer');
var Path = require('path');
var root = __dirname + '/../../';
var upload = multer({ dest: root + 'uploads/temp' });
var path = root + 'uploads';
var mkdirp = require('mkdirp');
var Movie = require('../models/Movie.js');
var User = require('../models/User.js');
var Message = require('../../strings.json');
var format = require('string-template');
var logger = require('minilog')('moviesRoutes');
var async = require('async');
var imageHash = '';

var cpUpload = upload.fields([{
  name: 'image',
  maxCount: 1
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

    var extension = req.files.image[0].originalname.split('.')[1];
    var regex = /png|gif|tiff|jpeg|jpg/i;

    if(!regex.test(extension)) {
      resData.msg = Message.NotImageExtension;
      resData.status = false;
      res.status(400).json(resData);
      return;
    }

    logger.log('requested files options', extension);

    var imagePath = root + 'uploads/temp/' + req.files.image[0].filename;
    var imageName = bCrypt.hashSync(req.user.id + req.body.title, bCrypt.genSaltSync(10), null).toString();
    imageName = imageName.replace(/\//g,'*');
    imageHash = imageName.replace(/\./g,'d');

    var newPath = format('{path}/public/{image}.{ext}', {
      path: path,
      image: imageHash,
      ext: extension
    });

    function storeImage(source, destination, callback) {
      var destDir = Path.dirname(destination);
      mkdirp(destDir, function created(err) {
        if (err) {
          callback(err);
          return;
        }

        fs.readFile(source, function read(err, data) {
          if (err) {
            callback(err);
            return;
          }

          fs.writeFile(destination, data, callback);
        });
      });
    }

    function onImageStored(err) {
      var movie = new Movie({
        title: req.body.title,
        link: req.body.link,
        addedBy: req.user.id,
        imageLink: imageHash,
        imageType: extension,
        created: getDate()
      });

      movie.save(onAdded);
    }

    function onAdded(err, movie) {
      if (err) {
        next(err);
        return;
      }

      fs.unlink(imagePath, function deleted(err) {
        if (err) {
          next(err);
          return;
        }

        /*return res.status(200).json({
          msg: Message.MovieAdded,
          success: true,
          data: movie.toObject()
        });*/

      return res.redirect('/');
      });
    }

    storeImage(imagePath, newPath, onImageStored);
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
      resData.msg = Message.MovieFound;
      resData.success = true;
      resData.data = _.invoke(movie, 'toObject');
      status = 200;

      res.status(status).json(resData);
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


    User.populate(movie, {path: 'addedBy', model: 'User'}, function(err, moviePopulated){
      var imageLink = moviePopulated.imageLink;

      var imagePath = format('{path}/public/{image}.{ext}', {
        path: path,
        image: imageLink,
        ext: movie.imageType
      });

      fs.readFile(imagePath, function(err, image) {
        if(err)
          return next(err);

        if(!image) {
          resData.msg = Message.ImageNotFound;
          resData.success = false;
          status = 400;
          return res.status(status).json(resData);
        }

        resData.msg = Message.MovieFound;
        resData.success = true;
        resData.data = moviePopulated.toObject();
        resData.imageUrl = req.protocol + "://" + req.get('host') + '/' + imageLink + '.' + moviePopulated.imageType;
        status = 200;

        return res.status(status).json(resData);
      });
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

    var imgPath = format('{path}/public/{image}.png', {
      path: path,
      image: movie.imageLink
    });

    fs.unlink(imgPath, function(err) {
      if(err)
        return next(err);

      return res.status(200).json(resData);
    });
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
  logger.log('Extracted filename:', req.files);
  logger.log('Extracted body', req.body);
  res.status(200).json({filename: req.files.image[0].filename});
}

function isAuthenticate(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    logger.error(Message.NotLoggedIn, res);
    res.redirect('/');
  }
}

router
  .use(isAuthenticate)
  .post('/', cpUpload, addMovie)
  .post('/upload', cpUpload, uploadImage)
  .get('/', listMovies)
  .get('/:movieId', showMovie)
  .delete('/:movieId', deleteMovie)
  .put('/:movieId', updateMovie);

module.exports = router;
