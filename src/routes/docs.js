'use strict';

var router = require('express').Router();
var logger = require('minilog')('docs');
var isAuthenticated = require('./isAuthenticated.js');
var path = require('path');
var docsPath = __dirname + '/../../app/dist/docs.html';
docsPath = path.resolve(docsPath);

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
