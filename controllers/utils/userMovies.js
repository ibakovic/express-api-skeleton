'use strict';

var mongoose = require("mongoose");
var Post = mongoose.model("Post");

function addMovie(req, res, next) {
    if(req.user.username != req.params.userId) return res.status(400).json({ msg: "Error: wrong URL, expected: " + req.user.username + ", got: " + req.params.userId });
    if (!req.body.title || (req.body.title == '') || (req.body.title == ' ')) return res.status(400).json({msg: 'Title missing!'});
    var exists = Post.where({ title: req.body.title, user: req.user.username });

    exists.find(function (err, videos){
        if(err) return next(err);
        if(videos.length != 0) return res.status(400).json("Title already exists");
  
        var videos = new Post({ title: req.body.title, link: req.body.link, user: req.user.username });
        videos.save(function (err, videos) {
            if (err) return next(err);

            res.status(200).json(videos);
        });
    });
}

function getAllUserMovies(req, res, next) {
    if(req.user.username != req.params.userId) return res.status(400).json({ msg: "Error: wrong URL, expected: " + req.user.username + ", got: " + req.params.userId });
    var videos = Post.where({user: req.user.username});

    videos.find(function (err, videos) {
        if(err) return next(err);
        if(videos.length == 0) return res.status(400).json("No movies to display");

        res.status(200).json(videos);
    });
}

module.exports = {
    addMovie: addMovie,
    getAllUserMovies: getAllUserMovies
};
