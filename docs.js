'use strict';

var router = require('express').Router();
var logger = require('minilog')('docs');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    logger.error('error', 'You must be logged in to do that.');
    res.redirect('/login');
  }
}

function getDocs(req, res, next) {
  return res.render('output.handlebars');
}

router
  .use(isAuthenticated)
  .get('/', getDocs);

module.exports = router;
