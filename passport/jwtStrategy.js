var JwtStrategy = require('passport-jwt').Strategy;
var opts = {};
var User = require('../models/auths');
opts.secretOrKey = 'secret';
opts.authScheme = 'Bearer';
//opts.issuer = "accounts.examplesoft.com";
//opts.audience = "yoursite.net";
module.exports = function(passport){
    passport.use('passJwt' , new JwtStrategy(opts, function(jwt_payload, done) {
        console.log("Something on jwtstrategy" + jwt_payload.username);
        //debugger;
        User.findOne({ username: jwt_payload.username }, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {

                done(null, user);
            } else {
                done(null, false);
                // or you could create a new account
            }
        });
    }));
};