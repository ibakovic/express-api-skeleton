'use strict';

var express = require("express");
var router = express.Router();
var posts = require('../models/posts');
var Movie = require('../models/posts');
var isAuthenticated = require('../isAuthenticated');

function getMovie(req, res, next) {
	Movie.findOne({ title: req.params.movieId, user: req.user.username }, function(err, movie) {
		if (err)
			return next(err);

		var status = 200;
		var resData = {};

		resData.msg = 'Movie found!';
		resData.success = true;

		if (!movie) {
			status = 400;
			resData.msg = 'Movie not found!'
			resData.success = false;
		}
		else 
			resData.data = movie;

		return res.status(status).json(resData);
	});
}

function deleteMovie(req, res, next) {
	Movie.findOne({ title: req.params.movieId, user: req.user.username }, function(err, movie) {
		if (err)
			return next(err);

		var status = 200;
		var delData = {};

		delData.success = true;
		delData.msg = 'Movie deleted';

		if (!movie) {
			status = 400;
			delData.msg = 'Title not found';
			delData.success = false;
		}
		else {
			movie.remove(function(err, removed) {
				if (err)
					return next(err);
				if (removed === 0) {
					delData.msg = 'Movie not deleted';
					status = 400;
					delData.success = false;
				}
			});
		}

		return res.status(status).json(delData);
	});
}

function updateMovie(req, res, next) {
	Movie.findOne({ title: req.params.movieId, user: req.user.username }, function(err, movie) {
		if (err)
			return next(err);

		var status = 200;
		var resData = {};

		resData.msg = 'Title updated!';
		resData.success = true;

		if (!movie) {
			status = 400;
			resData.msg = 'Title not found';
			resData.success = false;
		}
		else {
			if (!req.body.update || (req.body.update == '')) {
				status = 400;
				resData.msg = 'title to change to required';
				resData.success = false;
			}
			else
				Movie.findOne({ title: req.body.update, user: req.user.username }, function(err, upMovie) {
					if (err)
						return next(err);
					if (upMovie) {
						status = 400;
						resData.msg = 'Title already exists';
						resData.success = false;
					}
					else {
						movie.title = req.body.update;
						movie.save(function(err, data) {
							if (err)
								return next(err);
							if (!data) {
								status = 400;
								resData.msg = 'Title already exists';
								resData.success = false;
							}
						});
					}
				});
		}
		return res.status(status).json(resData);
	});
}

router
.use(isAuthenticated())
.post('/:movieId', updateMovie)
.get('/:movieId', getMovie)
.delete('/:movieId', deleteMovie);

module.exports = router;