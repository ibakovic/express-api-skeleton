'use strict';

var shortId = require('short-mongo-id');
var _ = require('lodash');

var defaults = {
  transform: function transformDocument(doc, ret, options) {
    // expose id publicly
    ret.id = doc._id;
    delete ret._id;

    // hide password from client
    if (ret.password)
      delete ret.password;
  },
  versionKey: false
};

function setupSerialization(schema, options) {
  options = options || {};
  if (!schema)
    return;

  var serializationOptions = _.defaults(options, defaults);
  schema.options.toObject = serializationOptions;
}

module.exports = {
  setupSerialization: setupSerialization
};
