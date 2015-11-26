'use strict';

var passport = require('passport');

module.exports = function isAuthenticated() {
    return passport.authenticate('passJwt', {session: false});
};
