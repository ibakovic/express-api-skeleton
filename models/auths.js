var mongoose = require('mongoose');

var AuthSchema = new mongoose.Schema({
  username: String,
  password: String
});

module.exports = mongoose.model('Auth', AuthSchema);
