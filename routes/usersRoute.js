var express = require("express");
var router = express.Router();
var users = require('../models/auths');
var isAuthenticated = require('../isAuthenticated');
var bCrypt = require('bcrypt-nodejs');

function getUser(req, res, next){
	var getUser = users.where({ username: req.user.username });
	getUser.find(function(err, user){
		if(err) return next(err);
		if(!user || (user.length == 0)) return res.status(200).json({ msg: 'User not found!!' });
		return res.status(200).json({ data: user });
	});
}

function deleteUser(req, res, next){
	var getUser = users.where({ username: req.user.username });
	getUser.findOne(function(err, user){
		if(err) return next(err);
		if(!user || (user.length == 0)) return res.status(400).json({ msg: 'User not found!!' });
		user.remove(function(err, removed){
			if(err) return next(err);
			if(removed == 0) return res.status(400).json({ msg: 'Failed to delete!!' });
			return res.status(200).json({ msg: 'User deleted!' });
			});
	});
}

function changePassword(req, res, next){
	var getUser = users.where({ username: req.user.username });
	var newPassword = bCrypt.hashSync(req.body.update, bCrypt.genSaltSync(10), null);
		console.log(newPassword);
	getUser.findOne(function(err, user){
		if(err) return next(err);
		if(!user || (user.length == 0)) return res.status(400).json({ msg: 'User not found!!' });
		console.log("user: " + user.username);
		user.password = newPassword;
		user.save(function(err, data){
			if(err) return next(err);
			if(!data) return res.status(400).json({ msg: "Data not saved!" });
			return res.status(200).json({ msg: "Data saved!!", data: data });
		});
	});
}

router
	.use(isAuthenticated())
	.post('/', changePassword)
	.get('/', getUser)
	.delete('/', deleteUser);

module.exports = router;
