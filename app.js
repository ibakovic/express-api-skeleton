'use strict';

var express = require('express');
var Path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var passport = require('passport');

// setup logging
require('minilog').enable();

// create server
var app = express();

// init passport
app.use(passport.initialize());
require('./passport/init.js')(passport);

// init mongoose
require('./models/init.js')();

// set handlebars engine and default view
app.enable('view cache');
app
  .engine('handlebars', handlebars({defaultLayout: 'loginPage'}))
  .set('view engine', 'handlebars');

// serve frontend
var hbFunc = require('./handlebars/hbFunc.js');
var loginFunc = require('./handlebars/loginFunc.js');

app
  .get('/loginPage', hbFunc);
  //.get('/authorized', loginFunc)

// serve static assets
app
  .use(express.static(Path.join(__dirname, 'public')));
  // uncomment after placing your favicon in /public
  //.use(favicon(__dirname + '/public/favicon.ico'));

// HTTP traffic logging
app.use(logger('dev'));

// handling HTTP request payload
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: false}));

// routers
var usersRoutes = require('./routes/usersRoutes.js');
var logRegRoutes = require('./routes/logRegRoutes.js');

// API endpoints
app
  .use('/', logRegRoutes)
  .use('/', usersRoutes);

module.exports = app;
