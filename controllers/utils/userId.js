'use strict';
var mongoose = require("mongoose");
var Auth = mongoose.model("Auth");
var jwt = require("jsonwebtoken");
var async = require("async");

function logIn(req, res, next) {
    function findUser(callback) {
        var query = Auth.where({ 
            username: req.body.username,
            password: req.body.password
        });
        query.find(function (err, user) {
            if(err) return next(err);
            if(user.length === 0) return callback(new Error( "Couldn\'t log in with these credentials" ));

            callback(null, user[0].username);
        });
    }

    function createToken(callback, results) {
        var token = "Bearer ";
        token += jwt.sign({
                    username: results.findUser
                },
                "secret");
        return res.status(200).json({tokens: token});
    }
    async.auto({
        findUser: findUser,
        createToken: ["findUser", createToken]
    }, function (err) {
        if(err) return res.status(400).json({ msg: "Couldn\'t log in with these credentials" });
    });
}

function updateUser(req, res, next) {
    function del(callback) {
        if(!req.body.update) return callback(new Error("updated password required"));
        var query = Auth.where({ username: req.params.username });

        query.find(function (err, user2) {
            if (err) return next(err);

            if (user2.length === 0) return callback(new Error());

            var username = user2[0].username;
            Auth.find({ username: user2[0].username }).remove().exec();

            var update = new Auth({ username: username, password: req.body.update });
            //console.log("before update:" + update);
            callback(null, update);
        });
    }

    function createNewUser(callback, results) {
        var auth = results.del;
        //console.log("updated: " + auth);

        auth.save(function (err, auth) {
            if (err) return next(err);

            callback(null, auth);
            //res.status(200).json(auth);
        });
    }

    async.auto({
        del: del,
        createNewUser: ["del", createNewUser]
    }, function (err, results) {
        //if(!req.body.update) res.status(400).json({ msg: "updated password required" });
        if(err) res.status(400).json({ msg: "Couldn\'t update this user" });

        res.status(200).json(results.createNewUser);
    });
}

function deleteUser(req, res, next) {
        var query = Auth.where({ username: req.params.username });

        query.find(function (err, user2) {
            if (err) return next(err);

            if (user2.length === 0) return res.status(400).json({ msg: "Couldn\'t find this user" });

            var username = user2[0].username;
            Auth.find({username: user2[0].username}).remove().exec();

            Auth.find(function(err, posts){
                if(err){ return next(err); }

                posts;
                return res.status(200).json({msg: "User " + username + " deleted", data: posts});
            });
        });
}

function getUser(req, res, next) {
    var query = Auth.where({ username: req.params.userId });

    query.find(function(err, posts){
    if(err){ return next(err); }

    res.json({username: posts[0].username});
  });
}

module.exports = {
    logIn: logIn,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUser: getUser
};
