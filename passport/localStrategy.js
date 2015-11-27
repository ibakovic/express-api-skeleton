'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users.js');
var logger = require('minilog')('passport:localStrategy');

function authorize(req, username, password, done) {
  logger.info('authorize user\nusername:', username, 'password:', password);

  User.findOne({username: username}, function(err, user) {
    if (err) {
      logger.info('Error retrieving user:', err.message);
      return done(err, false);
    }

    if (user)
      done(null, user);
    else
      done(null, false);
  });
}

module.exports = function initLocalStrategy(passport) {
  passport.use('auth', new LocalStrategy(authorize));
};
