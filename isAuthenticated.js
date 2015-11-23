'use strict';

var passJwt = require('passport-jwt');
var passport = require('passport');

var isAuthenticated = function() {
    return passport.authenticate('passJwt', { session: false});
};

module.exports = isAuthenticated;
