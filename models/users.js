'use strict';

var mongoose = require('mongoose');
var shortid = require('shortid');
var utils = require('./utils.js');

var UserSchema = new mongoose.Schema({
  _id: {
      type: String,
      unique: true,
      'default': shortid.generate
  },
  username: String,
  password: String
});

utils.setupSerialization(UserSchema);
module.exports = mongoose.model('User', UserSchema);