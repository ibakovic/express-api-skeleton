/**
  * app.js
  */
'use strict';

/**
  * Module dependencies
  */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('passport');
var app = express();
var hbFunc = require('./handlebars/hbFunc.js');
var loginFunc = require('./handlebars/loginFunc.js');
var format = require('string-template');

// Initialize module passport
app.use(passport.initialize());
var initPassport = require('./passport/init.js');
initPassport(passport);

// MongoDB
var mongoose = require('mongoose');

// MongoDB connection
var connection_string = 'localhost/movies';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  var formatString = 'mongodb://{username}:{password}@{host}:{port}/{appName}';

connection_string = format(formatString, {
    username: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
    password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
    host:     process.env.OPENSHIFT_MONGODB_DB_HOST,
    port:     process.env.OPENSHIFT_MONGODB_DB_PORT,
    appName:  process.env.OPENSHIFT_APP_NAME
  });
}

mongoose.connect('mongodb://' + connection_string);

//Routes modules

var usersRoutes = require('./routes/usersRoutes.js');
var logRegRoutes = require('./routes/logRegRoutes.js');

// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');*/

app.enable('view cache');

app
// set handlebars engine and default view
.engine('handlebars', exphbs({defaultLayout: 'main'}))
.set('view engine', 'handlebars')
//ger frontend
//.get('/', hbFunc)
//.get('/authorized', loginFunc)
.use(express.static('public'))
// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
.use(logger('dev'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: false }))
.use(cookieParser())
.use(express.static(path.join(__dirname, 'public')))
// api
.use('/', logRegRoutes)
.use('/', usersRoutes);

module.exports = app;
