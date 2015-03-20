'use strict';

var express = require('express');
var router = express.Router();
var controllers = require('../controllers');

router.route('/status')
  .get(controllers.utils.status);

// catch all not matched requests
router.route('*')
  .all(controllers.utils.catch404);

module.exports = router;
