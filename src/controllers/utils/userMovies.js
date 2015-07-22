'use strict';

var mongoose = require('mongoose');
var Post = mongoose.model('Post');

function addMovie(req, res, next) {
    var videos = new Post({ title: req.body.title, link: req.body.link, upvotes: req.body.upvotes, comments: req.user.username });

    videos.save(function (err, videos) {
        if (err) return next(err);

        res.status(200).json(videos);
    });
}

function getAllUserMovies(req, res, next) {
    var videos = Post.where({comments: req.user.username});

    videos.find(function (err, videos) { 
        if(err) return next(err);

        res.status(200).json(videos);
    });
}

module.exports = {
    addMovie: addMovie,
    getAllUserMovies: getAllUserMovies
};