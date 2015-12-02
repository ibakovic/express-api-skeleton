'use strict';

var router = require('express').Router();
var authenticate = require('./auth.js');

function logout(req, res, next) {
  req.logout();
  res.redirect('/login');
}

router
  .post('/login',    authenticate.login)
  .post('/register', authenticate.register)
  .get('/logout', logout);

module.exports = router;
