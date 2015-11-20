'use strict';

var express = require("express");
var router = express.Router();
var posts = require('../models/posts');
var isAuthenticated = require('../isAuthenticated');

function getMovie(req, res, next){
	var movie = posts.where({ title: req.params.movieId, user: req.user.username });
	movie.findOne(function(err, data){
		if(err) return next(err);
		if(!data || data.length == 0) return res.status(400).json({ msg: req.params.movieId + ' not found!' });
		return res.status(200).json({ data: data });
	});
}

function deleteMovie(req, res, next){
	var movie = posts.where({ title: req.params.movieId, user:req.user.username });
	movie.findOne(function(err, delMovie){
		if(err) return next(err);
		if(delMovie.length == 0) return res.status(400).json({ msg: 'Couldn\'t find your movie' });
		delMovie.remove(function(err, removed){
			if(err) return next(err);
			if(removed == 0) return res.status(400).json({ msg: req.params.movieId + ' not deleted' });
			return res.status(200).json({ msg: req.params.movieId + ' deleted!' });
		});
	});
}

function updateMovie(req, res, next){
	if(!req.body.update || (req.body.update == '') || (req.body.update == ' '))return res.status(400).json({ msg: 'Update required!!' });
	var movie = posts.where({ title: req.params.movieId, user: req.user.username });
	movie.findOne(function(err, upMovie){
		if(err) return next(err);
		if(!upMovie || upMovie.length == 0) return res.status(400).json({ msg: 'Movie not found' });
		var update = posts.where({ title: req.body.update, user: req.user.username });
		update.find(function(err, found){
			if(err) return next(err);
			if(found.length != 0) return res.status(400).json({ msg: found.title + ' already exists' });
			upMovie.title = req.body.update;
			upMovie.save(function(err, data){
				if(err) return next(err);
				res.status(200).json({ msg: 'Movie updated', data: data });
			});
		});
	});
}

router
.use(isAuthenticated())
.post('/:movieId', updateMovie)
.get('/:movieId', getMovie)
.delete('/:movieId', deleteMovie);

module.exports = router;