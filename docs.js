'use strict';

var router = require('express').Router();
var isAuthenticated = require('./isAuthenticated.js');

function getDocs(req, res, next) {
  return res.render('output.handlebars');
}

router
  .use(isAuthenticated())
  .get('/', getDocs);

module.exports = router;
