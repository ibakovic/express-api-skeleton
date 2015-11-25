'use strict';

var mongoose = require('mongoose');
var format = require('string-template');

function getConnectionString() {
  // MongoDB connection
  var connectionString = 'localhost/movies';
  if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    var formatString = 'mongodb://{username}:{password}@{host}:{port}/{appName}';

  connectionString = format(formatString, {
      username: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
      password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
      host:     process.env.OPENSHIFT_MONGODB_DB_HOST,
      port:     process.env.OPENSHIFT_MONGODB_DB_PORT,
      appName:  process.env.OPENSHIFT_APP_NAME
    });
  }

  return 'mongodb://' + connectionString;
}

module.exports = function init() {
  mongoose.connect(getConnectionString());
};
