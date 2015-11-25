'use strict';

var JwtStrategy = require('passport-jwt').Strategy;
var opts = {};
var User = require('../models/users.js');
opts.secretOrKey = 'secret';
opts.authScheme = 'Bearer';

module.exports = function(passport){
    passport.use('passJwt' , new JwtStrategy(opts, function(jwt_payload, done) {
       User.findById(jwt_payload.id, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};
