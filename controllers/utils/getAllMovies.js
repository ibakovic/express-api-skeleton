'use strict';
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

function getAll(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.status(200).json(posts);
  });
};

module.exports = getAll;