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
var fs = require('fs');
var less = require('less');

// setup logging
require('minilog').enable();

var lessFile = './public/stylesheets/lessStyle.less';
var cssFile = './public/stylesheets/style.css';

less.render(fs.readFileSync(lessFile).toString(), function(err, out) {
  //console.log(out.css);
  fs.writeFileSync(cssFile, out.css);
});

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
  .engine('handlebars', handlebars({defaultLayout: 'loginPage'}))
  .set('view engine', 'handlebars');

// serve frontend
var hbFunc = require('./handlebars/hbFunc.js');
var loginFunc = require('./handlebars/loginFunc.js');

app
  .get('/movieApp', hbFunc);
  //.get('/authorized', loginFunc)

// serve static assets
app
  .use(express.static(Path.join(__dirname, 'public')))
  .use(express.static(Path.join(__dirname, 'node_modules')))
  .use(express.static(Path.join(__dirname, 'public/stylesheets')))
  .use(express.static(Path.join(__dirname + '/jquery')))
  .use(favicon(__dirname + '/public/favicon.ico'));

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

// API endpoints
app
  .use('/', logRegRoutes)
  .use('/', usersRoutes);

// docs
app
  .use('/docs', docs);

module.exports = app;
