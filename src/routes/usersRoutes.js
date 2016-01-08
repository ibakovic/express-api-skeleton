'use strict';

var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var User = require('../models/User.js');
var Message = require('../../strings.json');
var moviesController = require('./moviesRoutes.js');
var _ = require('lodash');
var logger = require('minilog')('usersRoutes');

/**
 * @typedef ApiResponse
 * @param {String} message   server message
 * @param {Boolean} success    status flag
 * @param {Object} respData    server sent data
 */

/**
 * Creates a query to find the user with username
 */
function createUserQuery (req) {
  return {_id: req.user.id};
}

/**
 * Finds a user with username from a token (handles GET)
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function showUser(req, res, next) {
  User.findOne(createUserQuery(req), function (err, user) {
    if (err)
      return next(err);

    var respData = {};

    if (!user) {
      respData.success = false;
      respData.msg = Message.UserNotFound;
      return res.status(400).json(respData);
    }

    respData.success = true;
    respData.data = user.toObject();

    return res.status(200).json(respData);
  });
}

/**
 * Changes user password
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function updateUser(req, res, next) {
  var resData = {};
  resData.msg = Message.UserPasswordParameterRequired;
  resData.success = false;

  if(!req.body.oldPassword) {
    resData.msg = 'Old password required!';
    return res.status(400).json(resData.msg);
  }

  if (!req.body.update)
    return res.status(400).json(resData.msg);

  var updatedPassword = bCrypt.hashSync(req.body.update, bCrypt.genSaltSync(10), null);
  var passwordQuery = {password: updatedPassword};

  User.findOneAndUpdate(createUserQuery(req), passwordQuery, {'new': true}, function(err, data) {
    if (err)
      return next(err);

    var resData = {};
    resData.msg = Message.UserPasswordUpdated;
    resData.success = true;
    resData.data = data.toObject();

    return res.status(200).json(resData);
  });
}

/**
 * Deletes user (handles DELETE)
 * Additionally deletes all of his movies
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function deleteUser(req, res, next) {
  var resData = {};

  resData.msg = Message.UserDeleted;
  resData.success = true;

  var Movie = require('../models/Movie.js');
  var movieQuery = { addedBy: req.user.id };
  Movie.remove(movieQuery, function(err) {
    if (err)
      return next(err);
  });

  User.findOneAndRemove(createUserQuery(req), function(err) {
    if (err)
      return next(err);
    resData.redirect = '';
    res.status(200).json(resData);
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
  .get('/', showUser)
  .put('/', updateUser)
  .delete('/', deleteUser)
  .use('/movies', moviesController);

module.exports = router;
