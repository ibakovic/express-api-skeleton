'use strict';

var router = require('express').Router();
var authenticate = require('./auth.js');

function logout(req, res, next) {
  //req.session.destroy();
  req.logout();
  req.session.destroy(function(err) {
    res.status(200).json({msg: 'Logging out...', redirect: '/movieApp'});
  });
}

router
  .post('/login',    authenticate.login)
  .post('/register', authenticate.register)
  .get('/logout', logout);

module.exports = router;
