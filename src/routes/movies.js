'use strict';

var router = require('express').Router();
var Movie = require('../models/Movie.js');
var message = require('../../strings.json');

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

    resData.data = movies;
    resData.success = true;

    res.status(200).json(resData);
  });
}

router
  .get('/', getAllMovies);

module.exports = router;
