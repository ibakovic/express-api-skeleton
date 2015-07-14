'use strict';
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

function newVid(req, res, next) {
    //console.log("req user: " + req.user.username);
    
    var videos = new Post({ title: req.body.title, link: req.body.link, upvotes: req.body.upvotes, comments: req.user.username });

    videos.save(function (err, videos) {
        if (err) return next(err);

        res.status(200).json(videos);
    });
}

module.exports = newVid;