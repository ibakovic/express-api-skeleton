'use strict';

var express = require('express');
var Path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var handlebars = require('express-handlebars');
var passport = require('passport');
var docs = require('./src/routes/docs.js');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var less = require('less');

// setup logging
require('minilog').enable();

// create server
var app = express();

// init mongoose
var mongooseConnection = require('./src/models/init.js')();

// init session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongooseConnection})
}));

// set handlebars engine and default view
app.enable('view cache');
app
  .engine('.hbs', handlebars({extname: '.hbs'}))
  .set('view engine', '.hbs');

// serve static assets
app
  .use(express.static(Path.join(__dirname, 'node_modules')))
  .use(express.static(Path.join(__dirname, 'app/')))
  .use(express.static(Path.join(__dirname, 'uploads/public/')))
  .use(favicon(__dirname + '/app/dist/favicon.ico'));

// HTTP traffic logging
app.use(logger('dev'));

// handling HTTP request payload
app
  .use(bodyParser.json({limit: '50000kb'}))
  .use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

// init passport
app
  .use(passport.initialize())
  .use(passport.session());
require('./src/passport/init.js')(passport);

// serve frontend
var homePage = require('./src/routes/homePage.js');

// routers
var usersRoutes = require('./src/routes/users.js');
var logRegRoutes = require('./src/routes/logReg.js');
var mailHandler = require('./src/routes/mailHandler.js');

// API endpoints
app
  .use('/', homePage)
  .use('/', logRegRoutes)
  .use('/users', usersRoutes)
  .use('/email', mailHandler);

// docs
app
  .use('/docs', docs);

module.exports = app;
