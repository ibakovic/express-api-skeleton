'use strict';

var chain = require('connect-chain');
var passport = require('passport');
var nodemailer = require('nodemailer');
var Verification = require('../models/RegistrationNotConfirmed.js');
var User = require('../models/User.js');
var Message = require('../../strings.json');
var bCrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var format = require('string-template');
var logger = require('minilog')('auth');

/**
  * Creates token from user's login username
  * @param  {HttpRequest}              req
  * @param  {Httpresponse}             res
  * @param  {Function(req, res, next)} next
  */
function successResponse(req, res, next) {
    return res.status(200).cookie('user', req.user.id).json({msg: 'Logged in successfully!'});
}

/**
  * Responds to a succesful registration
  * @param  {HttpRequest}             req
  * @param  {Httpresponse}            res
  * @param  {Function(req, res, next)} next
  */
function registrationResponse(req, res, next) {
  var resData = {};
  if(!req.body.emailTo) {
    resData.msg = 'No e-mail to send verification mail to!';
    User.findOneAndRemove({username: req.body.username}, function(err, user) {
      if(err)
        return next(err);
      return res.status(400).json(resData);
    });
    return;
  }

  var userQuery = {username: req.body.username};

  User.findOne(userQuery, function(err, user) {
    if(err)
      return next(err);

    if(!user) {
      resData.msg = 'User not found';
      return res.status(400).json(resData);
    }

    var verQuery = {userId: user.id};

    Verification.findOne(verQuery, function(err, ver) {
      if(err)
        return next(err);

      if(!ver) {
        var id = bCrypt.hashSync(req.body.userId, bCrypt.genSaltSync(10), null).toString();
        id = id.replace(/\//g,'*');

        //str = str.replace(re, '');
        var verification = new Verification({
          verId: id,
          userId: user.id
        });
        verification.save(function(err, verified) {
          if(err)
            return next(err);

          var url = req.protocol + "://" + req.get('host') + '/#confirm/' + id;
          var transporter = nodemailer.createTransport({
            host: 'mail.vip.hr'
          });

          var mailOptions = {
            from: 'noreply@extensionengine.com',
            to: req.body.emailTo,
            subject: 'Verification for movieapp registration',
            text: 'Click on this link to verify your registration: ' + url
          };

          transporter.sendMail(mailOptions, function(err, info) {
            if(err) {
              logger.error(err);
              return res.status(400).json('Failed to send e-mail');
            }

            res.status(200).json('E-mail sent');
          });
        });
      }
    });
  });
}

module.exports = {
  login:    chain(passport.authenticate('login'), successResponse),
  register: chain(passport.authenticate('register'), registrationResponse)
};
