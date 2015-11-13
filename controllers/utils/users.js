'use strict';

var mongoose = require("mongoose");
var Auth = mongoose.model("Auth");
var Post = mongoose.model("Post");
var async = require("async");

//register functions
function register(req, res, next) {
    if ((!req.body.username || !req.body.password) || (req.body.username == ' ' || req.body.password == ' ')) {
	console.log(req.body);	
	return res.status(400).json({message: 'Username and password required!!'});
	}
    function findUser(callback) {
        var find = Auth.where({ username: req.body.username });
        find.findOne(function (err, user) {
            if (err) return next(err);

            if (user) {
                return callback(new Error("Username already exists."));
            }
            var auth = new Auth(req.body);
            //console.log(auth);
            return callback(null, auth);
        });
    }

    function saveUser(callback, results) { 
        var auth = results.findUser;
        //console.log(auth);

        auth.save(function (err, auth) {
            if (err) return next(err);

            var msg = "Registration succsesful!"
            res.status(200).json(msg);
        });
    }

    async.auto({
        findUser: findUser,
        saveUser: ["findUser", saveUser]
    }, function (err) { 
        if(err) return res.status(400).json({ msg: "Username already exists." });
    });
}

function getAllUsers(req, res, next) {
    Auth.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
}

module.exports = {
    register: register,
    getAllUsers: getAllUsers
};
