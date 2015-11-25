'use strict';

var chain = require('connect-chain');
var passport = require('passport');
var jwtoken = require('jsonwebtoken');
var Message = require('../strings.json');
var format = require('string-template');
var User = require('../models/users.js');
var _ = require('lodash');
var log = require('minilog')('login');
require('minilog').enable();

/**
  * Creates token from user's login username
  *
  * @param  {HttpRequest}         req
  * @param  {Httpresponse}        res
  * @param  {Function(req, res, next)} next
  */
function createToken (req, res, next) {
  var resData= {};
  var userQuery = { username: req.user.username };

  User.findOne(userQuery, function (err, users) {
    if (err)
      return next(err);
    resData.msg = Message.TokenCreated;
    resData.success = true;

    users = users.toObject();
    resData.data = users;

    var tokenString = 'Bearer {token}';
    resData.token = format(tokenString, {
      token: jwtoken.sign({
                  id: users.id
              },
              'secret',
              { expiresIn: 6000000000000000 })
      });

    return res.status(200).json(resData);
  });
}


/**
  * Responses to a succesful registration
  *
  * @param  {HttpRequest}         req
  * @param  {Httpresponse}        res
  * @param  {Function(req, res, next)} next
  */
function registrationResponse(req, res, next) {
  res.status(200).json({msg: Message.RegistrationComplete});
}

module.exports = {
  login:    chain(passport.authenticate('login'), createToken),
  register: chain(passport.authenticate('register'), registrationResponse)
};
