'use strict';

var passport = require('passport');
var logger = require('minilog')('isAuthenticated');

module.exports = function isAuthenticated() {
    return passport.authenticate('auth', {failureRedirect: '/login'});
};
