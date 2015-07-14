'use strict';
var jsonwebtoken = require('jsonwebtoken');
var mongoose = require('mongoose');
var Auth = mongoose.model('Auth');
var async = require('async');

//log in
function logIn(req, res, next) {
/*
    var query = Auth.where({ username: req.body.username, password: req.body.password });
    console.log(query);
    query.find(function (err, user2) {
        if (err) return next(err);
        if (user2.length == 0) return res.status(400).json({ msg: 'Couldn\'t log in with these credentials' });

        var token = "Bearer ";
        
        token += jsonwebtoken.sign(
                  {
                      username: req.body.username
                  },
                  'secret'
                );
                
                //token = req.user;
                console.log(token);
        return res.status(200).json({tokens: token});
    });*/

    function findUser(callback) { 
        var query = Auth.where({ username: req.body.username, password: req.body.password });
        if(!req.body.password)console.log('no password');
        if(!req.body.username)console.log('no username');

        query.find(function (err, user) { 
            if (err) return next(err);
            if(user.length == 0) return callback(new Error('Couldn\'t log in with these credentials'));
            console.log(user);

            return callback(null, user[0].username);
        });
    }

    function token(callback, results) { 
        var t = "Bearer ";
        console.log('results.findUser: ' + results.findUser);
        //console.log('results.findUser.username: ' + results.findUser.username);
        t += jsonwebtoken.sign(
            {
            username: results.findUser
            },
            'secret'
        );
        return res.status(200).json({tokens: t});
    }
    async.auto({
        findUser: findUser,
        token: ['findUser', token]
    }, function (err, results) { 
        if(err) return res.status(400).json({ msg: 'Couldn\'t log in with these credentials' });
    });
}

module.exports = logIn;