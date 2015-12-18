'use strict';

var mongoose = require('mongoose');

var VerificationSchema = new mongoose.Schema({
  verId: String,
  userId: {
    type: String,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 1800
  }
});

module.exports = mongoose.model('Verification', VerificationSchema);
