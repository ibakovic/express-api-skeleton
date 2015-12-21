'user strict';

var mongoose = require('mongoose');
var shortid = require('shortid');
var utils = require('./utils.js');

var MovieSchema = new mongoose.Schema({
  _id: {
      type: String,
      unique: true,
      'default': shortid.generate
  },
  title: String,
  link: String,
  addedBy: {
    type: String,
    ref: 'User'
  },
  created: 'string'
});

utils.setupSerialization(MovieSchema);
module.exports = mongoose.model('Movie', MovieSchema);
