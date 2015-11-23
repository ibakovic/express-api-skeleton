'use strict';

var Movie = require('../models/posts.js');
var exphbs  = require('express-handlebars');
var handlebars = require('handlebars');
var templateTexts = require('../templates/moviesTemplate.js');
	///templates/moviesTemplate.js');
var mongoMovies;
Movie.find(function(err, dbMovies) {
    mongoMovies = dbMovies;
});


module.exports = function loginFunc (req, res, next) {
    res.render('loggedin', {
        showTitle: true,

    helpers: {
        movies: function() {
          var movieText = templateTexts.userMoviesTemplate;
          var template = handlebars.compile(movieText);
          return template({movies: mongoMovies});
        }
    }
    });
};
