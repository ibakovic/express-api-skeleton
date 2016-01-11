'use strict';

var router = require('express').Router();
var path = require('path');
var homePageFile = __dirname + '/../../app/dist/index.html';
homePageFile = path.resolve(homePageFile);

function loadHomePage(req, res, next) {
  res.sendFile(homePageFile);
}

router
  .get('', loadHomePage);

module.exports = router;
