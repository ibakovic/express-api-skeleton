'use strict';
var mongoose = require('mongoose');
var Auth = mongoose.model('Auth');
var async = require('async');

//register
/*
function register(req, res, next) {
    function register2(callback) {
        var query = Auth.where({ username: req.body.username });
        query.findOne(function (err, user) {
            if (err) return next(err);

            if (user) {
                return res.status(400).json({ msg: 'Username already exists.' });
            }

            var auth = new Auth(req.body);

            auth.save(function (err, auth) {
                if (err) return next(err);

                res.status(200).json(auth);
            });
        });
    }

    async.auto({
        register2: register2
    }, function(err, results) { 
    if (err) return next(err); 

    //res.status(200).json(results); 
  });
}*/


function register(req, res, next) {
    function findUser(callback) {
        var find = Auth.where({ username: req.body.username });
        find.findOne(function (err, user) {
            if (err) return next(err);

            if (user) {
                return callback(new Error('Username already exists.'));
            }
            var auth = new Auth(req.body);
            console.log(auth);
            return callback(null, auth);
        });
    }

    function saveUser(callback, results) { 
        var auth = results.findUser;
        console.log(auth);

        auth.save(function (err, auth) {
            if (err) return next(err);

            res.status(200).json(auth);
        });
    }

    async.auto({
        findUser: findUser,
        saveUser: ['findUser', saveUser]
    }, function (err, results) { 
        if(err) return res.status(400).json({ msg: 'Username already exists.' });
    });
}
module.exports = register;