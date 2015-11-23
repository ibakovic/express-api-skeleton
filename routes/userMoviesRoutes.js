/**
 * userMoviesRoutes.js
 */
'use strict';

/**
 * Module dependencies
 */
var express = require("express");
var router = express.Router();
var Movie = require('../models/posts.js');
var isAuthenticated = require('../isAuthenticated.js');

/**
 * @typedef ApiResponse
 * @param {String} msg       server message
 * @param {Boolean} success	 status flag
 * @param {Object} data      server sent data
 */

/**
 * Gets all user movies (handles GET)
 * 
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function getUserMovies(req, res, next) {
	var query = { user: req.user.username };
	Movie.find(query, function(err, movie) {
		if (err)
			return next(err);

		var status = 200;
		var resMovie = {};

		resMovie.success = true;
		resMovie.msg = 'Your movies are ready';

		if (!movie) {
			resMovie.success = false;
			resMovie.msg = 'Movie not found';
			status = 400;
		}
		else
			resMovie.data = movie;

		res.status(status).json(resMovie);
	});
}

/**
 * Adds a new user movie (handles POST)
 * 
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function addMovie(req, res, next) {
	var movieQuery = {
		title:req.body.title,
		user: req.user.username
	};
	Movie.findOne(movieQuery, function(err, movie) {
		if (err)
			return next(err);

		var status = 200;
		var addData = {};

		addData.success = true;
		addData.msg = 'Movie added';

		if (!movie) {
			if (!req.body.title || req.body.title === '') {
				status = 400;
				addData.success = false;
				addData.msg = 'Title field empty';
			}
			else {
				movie = new Movie({ title: req.body.title, link: req.body.link, user: req.user.username });
				addData.data = movie;
				movie.save(function(err, data) {
					if (err)
						return next(err);
					if (!data) {
						status = 400;
						addData.success = false;
						addData.msg = 'Failed to save your movie';
					}
				});
			}
		}
		else {
			status = 401;
			addData.success = false;
			addData.msg = 'This title already exists';
		}
		res.status(status).json(addData);
	});
}

router
.use(isAuthenticated())
.post('/', addMovie)
.get('/', getUserMovies);

module.exports = router;