'use strict';

var mongoose = require('mongoose');

var MongoImageSchema = new mongoose.Schema({
  imageUrl: String,
  contentType: String
});

module.exports = mongoose.model('MongoImage', MongoImageSchema);

/**
 * fs (filestream) ce uzet sliku iz imageUrl-a te će to poslat u res.send...
 * imageUrl: /:username/:imageTitle
 * kod prijema mora se stvoriti nova slika u folderu images/:username
 * paziti da se imena slika ne ponavljaju za istog korisnika
 */
