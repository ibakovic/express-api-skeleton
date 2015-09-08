'use strict';
var mongoose = require("mongoose");
var Post = mongoose.model("Post");
var async = require("async");

function updateMovie(req, res, next) {
     if(!req.body.update || (req.body.update == '')) return res.status(400).json({ msg: "Movie title and updated title required!!" });
     function del(callback) {
            var query = Post.where({ title: req.params.movieId, user: req.user.username });
            query.find(function (err, user2) {
                if (err) return next(err);

                if (user2.length === 0) return callback(new Error("error"));

                Post.find({title: user2[0].title, user: user2[0].user}).remove().exec();
                
                callback(null, {title: req.body.update, user: user2[0].user});
            });
        }

        function createNewVideo(callback, results) {
            var update = new Post({title: results.del.title, user: results.del.user});
            
            update.save(function (err, update) {
                if (err) return next(err);

                callback(null, update);
                Post.find(function(err, posts){
                    if(err){ return next(err); }

                    posts;
                    return res.status(200).json({msg: "Movie updated", data: posts});
                });
               //res.status(200).json(auth);
            });
        }

        async.auto({
            del: del,
            createNewVideo: ["del", createNewVideo]
        }, function (err) { 
            if(err) res.status(400).json({ msg: "Couldn\'t update this user video" });

            //res.status(200).json(results.createNewVideo);
        });
}

function getUserMovie(req, res, next) {
    var movie = Post.where({ title: req.params.movieId, user: req.user.username });
    
    movie.find(function (err, movieId) {
        if(err) return next(err);
        
        res.status(200).json(movieId);
    });
}

function deleteMovie(req, res, next) {
    var query = Post.where({ title: req.params.movieId, user: req.user.username });
    
        query.find(function (err, user2) {
            if (err) return next(err);

            if (user2.length === 0) return res.status(400).json({ msg: "Couldn\'t find this user" });

            Post.find({title: user2[0].title, user: user2[0].user}).remove().exec();

            Post.find(function(err, posts){
                if(err){ return next(err); }

                posts;
                return res.status(200).json({msg: "Movie deleted"});
            });
        });
}

module.exports = {
    updateMovie: updateMovie,
    getUserMovie: getUserMovie,
    deleteMovie: deleteMovie
};
