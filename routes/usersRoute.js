'use strict';

var express = require('express');
var router = express.Router();
var isAuthenticated = require('../isAuthenticated.js');
var bCrypt = require('bcrypt-nodejs');
var User = require('../models/auths.js');

function fetchUser(req, res, next) {
	User.findOne({ username: req.user.username }, function(err, user) {
		if (err)
			return next(err);

		var respData = {};

		respData.success = true;
		respData.data = user;

		if (!user) {
			respData.success = false;
			respData.msg = 'User not found!';
		}

		return res.status(200).json(respData);
	});
}

function deleteUser(req, res, next) {
	var query = { username: req.user.username };
	User.findOne(query, function(err, user) {
		if (err)
			return next(err);

		var delData = {};
		var status = 200;

		delData.success = true;
		delData.msg = "User deleted";

		if (!user) {
			delData.success = false;
			delData.msg = 'User not found';
			status = 400;
		}
		else {
			user.remove(function(err, removed) {
				if (err)
					return next(err);
				if (removed === 0) {
					delData.success = false;
					delData.msg = 'User not deleted';
					status = 400;
				}
			});
		}
		return res.status(status).json(delData);
	});
}

function changePassword(req, res, next) {
	User.findOne({ username: req.user.username }, function(err, user) {
		if (err)
			return next(err);

		var status = 200;
		var upData = {};

		upData.success = true;
		upData.msg = 'Password updated';

		if (!user) {
			upData.success = false;
			upData.msg = 'User not found';
			status = 400;
		}
		else {
			user.password = bCrypt.hashSync(req.body.update, bCrypt.genSaltSync(10), null);
			user.save(function(err, data) {
				if (err)
					return next(err);
				if (!data) {
					upData.success = false;
					upData.msg = 'User password not updated!';
					status = 400;
				}
			});
		}
		return res.status(status).json(upData);
	});
}

router
	.use(isAuthenticated())
	.post('/',   changePassword)
	.get('/',    fetchUser)
	.delete('/', deleteUser);

module.exports = router;
