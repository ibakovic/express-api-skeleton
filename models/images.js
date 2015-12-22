'use strict';

var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

module.exports = mongoose.model('Image', ImageSchema);
