'use strict';

var login = require('./login');
var register = require('./register');
var jwtStrategy = require('./jwtStrategy');
var User = require('../models/users.js');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
      debugger;
        console.log('serializing user: ');
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      debugger;
        User.findById(id, function(err, user) {
            console.log('deserializing user:', user);
            done(err, user);
        });
    });

    login(passport);
    register(passport);
    jwtStrategy(passport);
};
