/**
 * mainRoutes.js
 */
'use strict';

/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var Movie = require('../models/posts.js');
var User = require('../models/auths.js');
var passport = require('passport');
var jwtoken = require('jsonwebtoken');
var Message = require('../strings.json');

/**
 * @typedef ApiResponse
 * @param {String} msg       server message
 * @param {Boolean} success  status flag
 * @param {Object} data      server sent data
 */

/**
 * Gets all movies (handles GET)
 * 
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function getAllMovies(req, res, next) {
    Movie.find(function(err, movies) {
        if (err)
            return next(err);
        var status = 200;
        var resData = {};

        resData.success = true;
        resData.msg = Message.MoviesReady;

        if (!movies) {
            resData.msg = Message.NoMoviesFound;
            resData.success = false;
            status = 400;
        }
        else
            resData.data = movies;
            
        return res.status(200).json(resData);
    });
}

/**
 * Gets all users (handles GET)
 * 
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function(req, res, next)} next
 * @augments res using ApiResponse format
 */
function getAllUsers(req, res, next) {
    User.find(function(err, users) {
        if (err)
            return next(err);

        var status = 200;
        var resData = {};

        resData.success = true;
        resData.msg = Message.UsersReady;

        if (!users) {
            resData.msg = Message.NoUsersFound;
            resData.success = false;
            status = 400;
        }
        else
            resData.data = users;
            
        return res.status(200).json(resData);
    });
}

router.route("/users")
.get(getAllUsers)
.post(passport.authenticate('register', {
	successRedirect: '/'
}),
 function(req, res) {
    res.status(200).json({msg: Message.RegistrationComplete});
 });

router.route("/login").post(passport.authenticate('login'),
    /**
     * Creates token
     * 
     * @param  {HttpRequest} req
     * @param  {HttpResponse} res
     */
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

module.exports = router;
