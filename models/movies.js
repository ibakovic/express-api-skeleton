'user strict';

var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
  title: String,
  link: String,
  user: String
});

module.exports = mongoose.model('Post', MovieSchema);
