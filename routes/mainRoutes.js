'use strict';

var express = require('express');
var router = express.Router();
var movies = require('../models/posts');
var auth = require('../models/auths');
var passport = require('passport');
var jwtoken = require('jsonwebtoken');

function getAllMovies(req, res, next){
    movies.find(function(err, mov){
        if(err) return next(err);
        if(!mov || (mov.length == 0)) return res.status(400).json({ msg: 'No movies found!' });
        return res.status(200).json({ data: mov });
    });
};

function getAllUsers(req, res, next){
    auth.find(function(err, auth){
        if(err) return next(err);
        if(!auth || auth.length == 0) return res.status(400).json({ msg: "No users found!" });
        return res.status(200).json({ data: auth });
    });
};

router.route("/users")
.get(getAllUsers)
.post(passport.authenticate('register', {
	successRedirect: '/'
}),
 function(req, res) {
    res.status(200).json({msg: "Registation completed"});
 });

router.route("/login").post(passport.authenticate('login'),
    function(req, res) {
    	var token = "Bearer ";
        token += jwtoken.sign({
                    username: req.user.username
                },
                'secret',
                { expiresIn: 6000000000000000 });
        return res.status(200).json({user: req.user.username, token: token});
    }
 );

router.route('/movies').get(getAllMovies);
/*
router.get("/", function(req, res) {
  res.render("index", { title: "Express" });
});
*/
module.exports = router;
