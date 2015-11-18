var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var handlebars = require('handlebars');
var templateTexts = require('./templates/moviesTemplate');
var passport = require('passport');
var expressSession = require('express-session');
var app = express();

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var initPassport = require('./passport/init.js');
initPassport(passport);

//MongoDB
var mongoose = require('mongoose');
require('./models/posts');
require('./models/auths');
require('./models/token');
//mongoose.connect('mongodb://localhost/movies');

var connection_string = 'localhost/movies';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect('mongodb://'+connection_string);

var routes = require('./index');
var dbUsers;

// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');*/

app.enable('view cache');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var Auth = mongoose.model("Auth");

app.get('/', function (req, res) {
    res.render('home', {
        showTitle: true,

        // Override `foo` helper only for this rendering.
        helpers: {
            movies: function(){
              var movieText = templateTexts.moviesTemplate;
              var template = handlebars.compile(movieText);
              return template({movies: [{title: "title1", user: "user1"},{title: "title2", user: "user2"},{title: "title3", user: "user3"},{title: "title4", user: "user4"}]});
            },
            users: function(){
                var userText = templateTexts.usersTemplate;

                Auth.find(function(err, posts){
                  if(err){ return next(err); }

                  dbUsers = posts;
                });
                var template = handlebars.compile(userText);
                return template({users: dbUsers});
            }
        }
    });
});

app.use(express.static('public'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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

app.use(routes);
// include error handlers
//errors(app);

module.exports = app;
