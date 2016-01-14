'use strict';

var router = require('express').Router();
var path = require('path');
var Message = require('../../strings.json');
var logger = require('minilog')('homePage');
var homePageFile = __dirname + '/../../app/dist/index.html';
homePageFile = path.resolve(homePageFile);

function loadHomePage(req, res, next) {
  logger.log('loading page');
  res.sendFile(homePageFile);
}

router
  .get('', loadHomePage);

module.exports = router;
