'use strict';

var router = require('express').Router();
var authenticate = require('./auth.js');
var logger = require('minilog')('logRegRoutes');

/**
 * Log out current user and destroy user's session
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}  res
 * @param  {Function(req, res, next)} next
 */
function logout(req, res, next) {
  req.session.destroy(function(err) {
    res.status(200).json({msg: 'Logging out...', redirect: ''});
  });
}

router
  .post('/login',    authenticate.login)
  .post('/register', authenticate.register)
  .get('/logout', logout);

module.exports = router;
