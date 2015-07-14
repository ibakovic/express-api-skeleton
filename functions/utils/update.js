'use strict';
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var async = require('async');

function update(req, res, next) {
     function del(callback) {
            var query = Post.where({ title: req.body.title, comments: req.user.username });

            query.find(function (err, user2) {
                if (err) return next(err);

                if (user2.length == 0) return callback(new Error('error'));

                Post.find({title: user2[0].title, comments: user2[0].comments}).remove().exec();
                console.log("movie deleted");
                console.log("update: " + req.body.update);


                callback(null, {title: req.body.update, upvotes: 0, comments: user2[0].comments});
            });
        }
 
        function createNewVideo(callback, results) { 
            var update = new Post({title: results.del.title, upvotes: 0, comments: results.del.comments});
            console.log('This is update ' + update.title);

            update.save(function (err, update) {
                if (err) return next(err);

                callback(null, update);
                Post.find(function(err, posts){
                    if(err){ return next(err); }

                    posts;
                    return res.status(200).json({msg: 'Movie updated', data: posts});
                });
               //res.status(200).json(auth);
            });
        }

        async.auto({
            del: del,
            createNewVideo: ['del', createNewVideo]
        }, function (err, results) { 
            if(err) res.status(400).json({ msg: 'Couldn\'t find this user' });

            //res.status(200).json(results.createNewVideo);
        });
}

module.exports = update;