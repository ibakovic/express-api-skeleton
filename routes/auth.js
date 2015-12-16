'use strict';

var chain = require('connect-chain');
var passport = require('passport');
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
function successResponse(req, res, next) {
    return res.status(200).cookie('user', req.user.id).json({msg: 'Logged in successfully!'});
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
  login:    chain(passport.authenticate('login'), successResponse),
  register: chain(passport.authenticate('register'), registrationResponse)
};
