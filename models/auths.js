var mongoose = require('mongoose');

var AuthSchema = new mongoose.Schema({
  username: String,
  password: String
});

mongoose.model('Auth', AuthSchema);