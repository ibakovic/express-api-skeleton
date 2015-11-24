'use strict';

var User = require('../models/users.js');
var handlebars = require('handlebars');
var templateTexts = require('../templates/moviesTemplate.js');
var dbUsers;

var mongoUsers;
    User.find(function(err, dbUsers) {
        mongoUsers = dbUsers;
    });

module.exports = function hbFunc (req, res, next) {
  res.render('home', {
        showTitle: true,

    helpers: {
        movies: function() {
          var movieText = templateTexts.moviesTemplate;
          var template = handlebars.compile(movieText);
          return template({movies: [{title: "title1", user: "user1"},{title: "title2", user: "user2"},{title: "title3", user: "user3"},{title: "title4", user: "user4"}]});
        },
        users: function() {
            var userText = templateTexts.usersTemplate;

            var template = handlebars.compile(userText);
            return template({users: mongoUsers});
        }
    }
    });
};
