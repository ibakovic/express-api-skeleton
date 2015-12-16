'use strict';

var handlebars = require('handlebars');

module.exports = function hbFunc (req, res, next) {
  res.render('home', {
        showTitle: true,
    });
};
