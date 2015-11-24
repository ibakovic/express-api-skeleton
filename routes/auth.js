/**
  * auth.js
  */
'use strict';

var chain = require('connect-chain');
var passport = require('passport');
var jwtoken = require('jsonwebtoken');
var Message = require('../strings.json');
var format = require('string-template');

/**
  * Creates token from user's login username
  *
  * @param  {HttpRequest}         req
  * @param  {Httpresponse}        res
  * @param  {Function(req, res, next)} next
  */
function createToken (req, res, next) {
  var resData= {};

  resData.msg = Message.TokenCreated;
  resData.success = true;

  var tokenString = 'Bearer {token}';
  resData.token = format(tokenString, {
    token: jwtoken.sign({
                username: req.user.username
            },
            'secret',
            { expiresIn: 6000000000000000 })
    });

  return res.status(200).json(resData);
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
