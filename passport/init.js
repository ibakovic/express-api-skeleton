'use strict';

var logger = require('minilog')('Passport');
var User = require('../models/users.js');
var login = require('./login');
var register = require('./register');
var jwtStrategy = require('./jwtStrategy');
var localStrategy = require('./localStrategy.js');

function serializeUser(user, done) {
  logger.log('Serializing user: ', user);
  done(null, user._id);
}

function deserializeUser(id, done) {
  User.findById(id, function(err, user) {
    logger.log('Deserializing user:', user);
    done(err, user);
  });
}

module.exports = function initPassport(passport) {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  login(passport);
  register(passport);
  //jwtStrategy(passport);
  localStrategy(passport);
};
