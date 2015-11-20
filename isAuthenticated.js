var passJwt = require('passport-jwt');
var jwtoken = require('jsonwebtoken');
var passport = require('passport');

var isAuthenticated = function(){
    return passport.authenticate('passJwt', { session: false});
};

module.exports = isAuthenticated;
