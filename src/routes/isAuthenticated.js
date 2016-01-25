'use strict';

var Message = require('../../strings.json');
var logger = require('minilog')('isAuthenticated');

/**
 * Authenticates user
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}   res
 * @param  {Function(req, res, next)} next
 * @return {Boolean}       If user is authenticated, next function is executed, else user is redirected to login page
 */
function isAuthenticate(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    logger.error(Message.NotLoggedIn, res);
    res.redirect('/');
  }
}

module.exports = isAuthenticate;
