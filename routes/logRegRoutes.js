'use strict';

var router = require('express').Router();
var authenticate = require('./auth.js');

router
  .post('/login',    authenticate.login)
  .post('/register', authenticate.register);

module.exports = router;
