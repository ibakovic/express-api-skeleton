'use strict';

var JwtStrategy = require('passport-jwt').Strategy;
var User = require('../models/users.js');

function authorize(jwtPayload, done) {
  User.findById(jwtPayload.id, function(err, user) {
    if (err)
      return done(err, false);

    if (user)
      done(null, user);
    else
      done(null, false);
  });
}

module.exports = function jwtStrategy(passport) {
  var authOptions = {
    secretOrKey: 'secret',
    authScheme: 'Bearer'
  };

  passport.use('passJwt' , new JwtStrategy(authOptions, authorize));
};
