var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
  username: String,
  token: String
});

mongoose.model('Token', TokenSchema);