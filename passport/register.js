'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users.js');
var bCrypt = require('bcrypt-nodejs');
var format = require('string-template');
var logger = require('minilog')('register');

/**
 * Creates password hash
 * @param  {String} password provided password
 * @return {String}          hashed output
 */
function createHash(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

/**
 * Creates new user in database with provided credentials
 * @param {String} username
 * @param {String} password
 * @param {Function(err, user)} done callback
 */
function createUser(username, password, done) {
  User.findOne({username: username}, function(err, user) {
    if (err) {
      logger.error('Error during signup:', err.message);
      return done(err);
    }

    if (user) {
      logger.error(format('Error: User "{username}" already exists.', {username: username}));
      return done(null, false);
    }

    // if there is no user
    // with given email then create new one
    var newUser = new User({
      username: username,
      password: createHash(password)
    });

    // save the user
    newUser.save(function(err) {
      if (err) {
        logger.error('Error saving user:', err.message, 'user:', username);
        throw err;
      }

      logger.log('User "{username}" successfully registered', {username: username});
      done(null, newUser);
    });
  });
}

function processRegistration(req, username, password, done) {
  logger.info('Processing registration,',
    'username:', username,
    'password:', password);

  // Delay the execution of createUser and execute the method
  // in the next tick of the event loop
  process.nextTick(function() {
    createUser(username, password, done);
  });
}

module.exports = function initRegistration(passport){
  passport.use('register', new LocalStrategy({
    passReqToCallback: true
  }, processRegistration));
};
