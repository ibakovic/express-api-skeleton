'use strict';

var express = require("express");
var router = express.Router();
var posts = require('../models/posts');
var isAuthenticated = require('../isAuthenticated');

function getUserMovies(req, res, next){
	var movies = posts.where({ user: req.user.username });
	movies.find(function(err, data){
		if(err) return next(err);
		if(!data) return res.status(400).json({ msg: "Couldn't get your movies " + req.user.username });
		if(data.length == 0)return res.status(200).json({ msg: "No movies to display" });
		return res.status(200).json({ data: data });
	});
}

function addMovie(req, res, next){
	if((req.body.title == '') || (req.body.title == ' ') || !req.body.title) return res.status(400).json({ msg: "Title required!!" });
	if(!req.body.link) req.body.link = "";
	var checkTitle = posts.where({ title: req.body.title, user: req.user.username });
	checkTitle.find(function(err, title){
		if(err) return next(err);
		if(title.length != 0) return res.status(400).json({ msg: req.body.title + " already exists!" });
		var movie = new posts({ title: req.body.title, link: req.body.link, user: req.user.username });
		movie.save(function(err, data){
			if(err) return next(err);
			if(!data) return res.status(400).json({ msg: "Movie not saved!!!" });
			return res.status(200).json({ msg: data.title + " added", data: data });
		});
	}); 
}

router
.use(isAuthenticated())
.post('/', addMovie)
.get('/', getUserMovies);

module.exports = router;