var router = require('express').Router();
var nodemailer = require('nodemailer');
var logger = require('minilog')('mailHandler');

function mailHandler (req, res, next) {
  var url = req.protocol + "://" + req.get('host') + '#confirm';
  var transporter = nodemailer.createTransport({
    host: 'mail.vip.hr'
  });

  var mailOptions = {
    from: 'noreply@extensionengine.com',
    to: 'ibakovic@extensionengine.com',
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
}

router.
  get('', mailHandler);

module.exports = router;
