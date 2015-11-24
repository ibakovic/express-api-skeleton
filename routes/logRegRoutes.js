/**
  * logRegRoutes.js
  */

'use strict';

var express = require('express');
var router = express.Router();
var authenticate = require('./auth.js');
var Message = require('../strings.json');

router
.post('/login',    authenticate.login)
.post('/register', authenticate.register);

module.exports = router;
