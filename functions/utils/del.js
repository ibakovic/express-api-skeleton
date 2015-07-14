'use strict';
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

function del(req, res, next) {
    var queryVid = Post.where({ title: req.body.title, comments: req.user.username });

    queryVid.find(function (err, user2) {
    if (err) return next(err);

    if (user2.length == 0) return res.status(400).json({ msg: 'Couldn\'t find this video' });

    Post.find({title: user2[0].title, comments: user2[0].comments}).remove().exec();

    Post.find(function(err, posts){
    if(err){ return next(err); }

    posts;
    return res.status(200).json({msg: 'Movie deleted', data: posts});
    });
    });
}

module.exports = del;