/**
 * usersRoutes.js
 */

'use strict';

/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var isAuthenticated = require('../isAuthenticated.js');
var bCrypt = require('bcrypt-nodejs');
var User = require('../models/auths.js');

/**
 * @typedef ApiResponse
 * @param {String} msg       server message
 * @param {Boolean} success	 status flag
 * @param {Object} data      server sent data
 */

/**
 * Creates a query to find the user with username
 */
function createUserQuery (req) {
	return { 
		username: req.user.username 
	};
}

/**
 * Finds a user with username from a token (handles GET)
 * 
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function fetchUser(req, res, next) {
	User.findOne(createUserQuery(req), function(err, user) {
		if (err)
			return next(err);

		var respData = {};

		respData.success = true;
		respData.data = user;

		if (!user) {
			respData.success = false;
			respData.msg = 'User not found!';
		}

		return res.status(200).json(respData);
	});
}

/**
 * Deletes user (handles DELETE)
 * Additionally deletes all movies with user's username
 * 
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function deleteUser(req, res, next) {
	var resData = {};
	
	resData.msg = 'Movie deleted';
	resData.success = true;
	
	User.findOneAndRemove(createUserQuery(req), function(err) {
		if (err)
			return next(err);
		res.status(200).json(resData);
	});

	var Movie = require('../models/posts.js');
	Movie.remove(createUserQuery(req), function(err) {
		if (err)
			return next(err);
	});
}

/**
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function changePassword(req, res, next) {
	var resData = {};
	resData.msg = 'Update required!';
	resData.success = false;
	if (!req.body.update)
		return res.status(400).json(resData);

	var updatedPassword = bCrypt.hashSync(req.body.update, bCrypt.genSaltSync(10), null);
	var passwordQuery = {
		password: updatedPassword
	};
	User.findOneAndUpdate(createUserQuery(req), passwordQuery, {'new': true}, function(err, data) {
		if (err)
			return next(err);

		var resData = {};
		resData.msg = 'Password updated!';
		resData.success = true;
		resData.data = data;

		return res.status(200).json(resData);
	});
}

router
	.use(isAuthenticated())
	.post('/',   changePassword)
	.get('/',    fetchUser)
	.delete('/', deleteUser);

module.exports = router;
