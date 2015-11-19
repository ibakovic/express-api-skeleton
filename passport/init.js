var login = require('./login');
var register = require('./register');
var jwtStrategy = require('./jwtStrategy');
var mongoose = require('mongoose');
var User = mongoose.model('Auth');

module.exports = function(passport){
	passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });

    login(passport);
    register(passport);
    jwtStrategy(passport);
};