'use strict';

var router = require('express').Router();
var logger = require('minilog')('mailHandler');
var Verification = require('../models/RegistrationNotConfirmed.js');
var User = require('../models/User.js');
var Message = require('../../strings.json');

/**
 * Confirms registration by deleting user's expiration time
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}   res
 * @param  {Function(req, res, next)} next
 * @return {json}        response with status 200 or 400 and data in json format
 */
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
