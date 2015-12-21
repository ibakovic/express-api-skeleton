'use strict';

var express = require('express');
var Path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var handlebars = require('express-handlebars');
var passport = require('passport');
var docs = require('./docs.js');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var less = require('less');

var fs = require('fs');
var image = fs.readFileSync('images/Background.png');

function getImages(req, res, next) {
   res.writeHead(200, {'Content-Type': 'image/gif' });
   res.end(image, 'binary');
}

// setup logging
require('minilog').enable();

// create server
var app = express();

// init mongoose
var mongooseConnection = require('./models/init.js')();

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
  .engine('handlebars', handlebars({defaultLayout: '../../app/dist/index.handlebars'}))
  .set('view engine', 'handlebars');

// serve frontend
var hbFunc = require('./handlebars/hbFunc.js');

app
  .get('', hbFunc);

// serve static assets
app
  .use(express.static(Path.join(__dirname, 'app')))
  .use(express.static(Path.join(__dirname, 'images')))
  .use(express.static(Path.join(__dirname, 'node_modules')))
  .use(express.static(Path.join(__dirname, 'app/src/style')))
  .use(express.static(Path.join(__dirname, 'app/dist')))
  .use(express.static(Path.join(__dirname + '/jquery')))
  .use(favicon(__dirname + '/app/dist/favicon.ico'));

// HTTP traffic logging
app.use(logger('dev'));

// handling HTTP request payload
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

// init passport
app
  .use(passport.initialize())
  .use(passport.session());
require('./passport/init.js')(passport);

// routers
var usersRoutes = require('./routes/usersRoutes.js');
var logRegRoutes = require('./routes/logRegRoutes.js');
var mailHandler = require('./routes/mailHandler.js');

// API endpoints
app
  .get('/images', getImages)
  .use('/', logRegRoutes)
  .use('/users', usersRoutes)
  .use('/email', mailHandler);

// docs
app
  .use('/docs', docs);

module.exports = app;
