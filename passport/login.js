'use strict';

var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/users.js');
var bCrypt = require('bcrypt-nodejs');
var log = require('minilog')('app');
require('minilog').enable();

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
};

function processLogin(req, username, password, done)  {
  // check in mongo if a user with username exists or not
  User.findOne({username:  username}, function(err, user) {
    // In case of any error, return using the done method
    if (err)
      return done(err);

    // Username does not exist, log the error and redirect back
    if (!user) {
      log.log('User Not Found with username '+username);
      return done(null, false);
    }

    // User exists but wrong password, log the error
    if (!isValidPassword(user, password)) {
      log.log('Invalid Password');
      return done(null, false); // redirect back to login page
    }

    // User and password both match, return user from done method
    // which will be treated like success
    return done(null, user);
  });
}

module.exports = function(passport){
  passport.use('login', new LocalStrategy({passReqToCallback : true}, processLogin));
};
