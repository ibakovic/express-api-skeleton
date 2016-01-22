'use strict';

var router = require('express').Router();
var logger = require('minilog')('docs');
var path = require('path');
var docsPath = __dirname + '/../../app/dist/docs.html';
docsPath = path.resolve(docsPath);

/**
 * Authenticates user
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}   res
 * @param  {Function(req, res, next)} next
 * @return {Boolean}       If user is authenticated, next function is executed, else user is redirected to login page
 */
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    logger.error('error', 'You must be logged in to do that.');
    res.redirect('/');
  }
}

/**
 * Gets HTML docs page
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}   res
 * @param  {Function(req, res, next)} next
 * @return {HTML file}        Returns docs.html
 */
function getDocs(req, res, next) {
  return res.sendFile(docsPath);
}

router
  .use(isAuthenticated)
  .get('/', getDocs);

module.exports = router;
