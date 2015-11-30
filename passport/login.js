'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users.js');
var bCrypt = require('bcrypt-nodejs');
var format = require('string-template');
var logger = require('minilog')('login');

/**
 * Compares hashed passwords
 * @param  {String} password1 first password
 * @param  {String} password2 second password
 * @return {Boolean}          return value indicating whether original passwords match
 */
function matchPassword(password1, password2) {
  return bCrypt.compareSync(password2, password1);
}

/**
 * Verifies given credentials by consulting database
 * @param  {HTTPRequest}           req      login request coming from API
 * @param  {String}                username provided username
 * @param  {String}                password provided password
 * @param  {Function(error, user)} done     callback
 */
function processLogin(req, username, password, done) {
  User.findOne({username:  username}, function(err, user) {
    if (err)
      return done(err);

    if (!user) {
      logger.error(format('Error: Login failed, user "{username}" is not found!', {username: username}));
      return done(null, false);
    }

    if (!matchPassword(user.password, password)) {
      logger.error('Error: Login failed, invalid password provided!', 'user:', user);
      return done(null, false);
    }

    // User and password both match, return user from done method
    // which will be treated like success
    done(null, user);
  });
}

module.exports = function initLogin(passport) {
  passport.use('login', new LocalStrategy({passReqToCallback : true}, processLogin));
};
