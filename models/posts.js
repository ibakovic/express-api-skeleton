var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  user: String
});

module.exports = mongoose.model('Post', PostSchema);
