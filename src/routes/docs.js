'use strict';

var router = require('express').Router();
var logger = require('minilog')('docs');
var path = require('path');
var docsPath = __dirname + '/../../app/dist/docs.html';
docsPath = path.resolve(docsPath);


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    logger.error('error', 'You must be logged in to do that.');
    res.redirect('/');
  }
}

function getDocs(req, res, next) {
  return res.sendFile(docsPath);
}

router
  .use(isAuthenticated)
  .get('/', getDocs);

module.exports = router;
