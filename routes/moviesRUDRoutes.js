/**
 * moviesRUDRoutes.js
 */

'use strict';

/**
 * Module dependecies
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
 * Creates a query to find a movie with title and username
 */
function createMovieQuery(req) {
	return {
		title: req.params.movieId, 
		user: req.user.username
	};
}

/**
 * Gets requested movie (handles GET)
 * 
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
  * @augments res using ApiResponse format
 */
function getMovie(req, res, next) {
	Movie.findOne(createMovieQuery(req), function(err, movie) {
		if (err)
			return next(err);

		var status = 200;
		var resData = {};

		resData.msg = 'Movie found!';
		resData.success = true;

		if (!movie) {
			status = 400;
			resData.msg = 'Movie not found!';
			resData.success = false;
		}
		else
			resData.data = movie;

		return res.status(status).json(resData);
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
function deleteMovie(req, res, next) {
	var resData = {};
	resData.msg = 'Movie deleted';
	resData.success = true;
	Movie.findOneAndRemove(createMovieQuery(req), function(err) {
		if (err)
			return next(err);
		res.status(200).json(resData);
	});
}

/**
 * Updates movies (handles POST)
 * 
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function updateMovie(req, res, next) {
	var resData = {};
	var status = 400;
	
	if (!req.body.update) {
		resData.msg = 'Update required!';
		return res.status(status).json(resData);
	}

	var titleQuery = {title: req.body.update};

	Movie.findOne(titleQuery, function(err, duplicatedMovie) {
		if (err)
			return next(err);

		// handle duplicated title
		if (duplicatedMovie) {
			resData.msg = 'Title already exists';
			return res.status(status).json(resData);
		}

		Movie.findOneAndUpdate(createMovieQuery(req), titleQuery, {'new': true}, function(err, data) {
			if (err)
				return next(err);

			resData.data = data;
			resData.msg = 'Movie updated';
			status = 200;

			return res.status(status).json(resData);
		});
	});
}

/**
 * {Function()} isAuthenticated check if the user is authorized to get, update or delete a movie
 */
router
.use(isAuthenticated())
.post('/:movieId', updateMovie)
.get('/:movieId', getMovie)
.delete('/:movieId', deleteMovie);

module.exports = router;