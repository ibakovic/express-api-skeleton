'use strict';

var router = require('express').Router();
var nodemailer = require('nodemailer');
var logger = require('minilog')('mailHandler');
var Verification = require('../models/RegistrationNotConfirmed.js');
var User = require('../models/User.js');
var Message = require('../../strings.json');

function confirmRegistration(req, res, next) {
  var resData = {};
  if(!req.body.verId) {
    resData.msg = Message.VerificationIdMissing;
    res.status(400).json(resData);
  }
  var verQuery = {verId: req.body.verId};

  Verification.findOne(verQuery, function(err, ver) {
    if(err)
      return next(err);

    if(!ver) {
      resData.msg = Message.VerificationIdNotFound;
      return res.status(400).json(resData);
    }

    var userQuery = {_id: ver.userId};
    var expQuery = {createdAt: null};

    ver.remove(function(err) {
      if (err) {
        next(err);
        return;
      }
    });

    User.findOneAndUpdate(userQuery, expQuery, {'new': true}, function(err, data) {
      if (err)
        return next(err);

      resData.msg = Message.RegistrationComplete;
      resData.success = true;
      resData.data = data;

      return res.status(200).json(resData);
    });
  });
}

router
  .post('', confirmRegistration);

module.exports = router;
