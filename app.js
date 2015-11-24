'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var handlebars = require('handlebars');
var templateTexts = require('./templates/moviesTemplate.js');
var passport = require('passport');
var app = express();
var hbFunc = require('./handlebars/hbFunc.js');
var loginFunc = require('./handlebars/loginFunc.js');
var format = require('string-template');

app.use(passport.initialize());

var flash = require('connect-flash');
app.use(flash());

var initPassport = require('./passport/init.js');
initPassport(passport);
//MongoDB
var mongoose = require('mongoose');
require('./models/posts.js');
require('./models/auths.js');

var connectionStr = 'localhost/movies';

var connection_string = 'localhost/movies';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  /*connectionStr = util.format('mongodb://%s:%s@%s:%d/%s',
    process.env.OPENSHIFT_MONGODB_DB_USERNAME,
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
    process.env.OPENSHIFT_MONGODB_DB_HOST,
    process.env.OPENSHIFT_MONGODB_DB_PORT,
    process.env.OPENSHIFT_APP_NAME);*/
var formatString = 'mongodb://{username}:{password}@{host}:{port}/{appName}';
connection_string = format(formatString, {
  username: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
  password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
  host:     process.env.OPENSHIFT_MONGODB_DB_HOST,
  port:     process.env.OPENSHIFT_MONGODB_DB_PORT,
  appName:  process.env.OPENSHIFT_APP_NAME
});
/*process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;*/
}

mongoose.connect('mongodb://'+connection_string);

var routes = require('./routes/mainRoutes.js');
var usersRoute = require('./routes/usersRoute.js');
var userMoviesRoutes = require('./routes/userMoviesRoutes.js');
var moviesRUDRoutes = require('./routes/moviesRUDRoutes.js');

// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');*/

app.enable('view cache');

app
.engine('handlebars', exphbs({defaultLayout: 'main'}))
.set('view engine', 'handlebars');

app
  .get('/', hbFunc)
  .get('/authorized', loginFunc)
  .use(express.static('public'))
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
  .use(logger('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use('/', routes);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
*/
// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}*/

// production error handler
// no stacktraces leaked to user
/*app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});*/

app
  .use(routes)
  // api
  .use('/users/loggedin',        usersRoute)
  .use('/users/loggedin/movies', userMoviesRoutes)
  .use('/users/loggedin/movies', moviesRUDRoutes);

// include error handlers
//errors(app);

module.exports = app;
