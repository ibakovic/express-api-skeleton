'use strict';

var chain = require('connect-chain');
var passport = require('passport');
var jwtoken = require('jsonwebtoken');
var User = require('../models/users.js');
var Message = require('../strings.json');
var _ = require('lodash');
var format = require('string-template');
var logger = require('minilog')('auth');

/**
  * Creates token from user's login username
  * @param  {HttpRequest}              req
  * @param  {Httpresponse}             res
  * @param  {Function(req, res, next)} next
  */
function createToken(req, res, next) {
  var username = req.user.username;

  var resData = {};
  var userQuery = {username: username};

  User.findOne(userQuery, function(err, user) {
    if (err)
      return next(err);

    resData.msg = Message.TokenCreated;
    resData.success = true;

    user = user.toObject();
    resData.data = req.user;

    /*var token = jwtoken.sign({id: user.id},
      'secret', {expiresIn: 6000000000000000 });*/

    logger.info('New JWT token issued for',
      'username:', username);

    //resData.token = format('Bearer {token}', {token: token});
    return res.status(200).json(resData);
  });
}

/**
  * Responds to a succesful registration
  * @param  {HttpRequest}             req
  * @param  {Httpresponse}            res
  * @param  {Function(req, res, next)} next
  */
function registrationResponse(req, res, next) {
  res.status(200).json({msg: Message.RegistrationComplete});
}

module.exports = {
  login:    chain(passport.authenticate('login'), createToken),
  register: chain(passport.authenticate('register'), registrationResponse)
};
