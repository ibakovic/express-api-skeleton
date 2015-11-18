var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var controllers = require("./controllers");
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var initPassport = require('./passport/init');
initPassport(passport);

var jsonParser = bodyParser.json();
app.use(jsonParser);

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};

router.route("/users")
.get(controllers.utils.getAllUsers)
.post(passport.authenticate('register', {
	successRedirect: 'localhost:8080/users/'
}),
 function(req, res) {
    if(isAuthenticated) {
    res.status(200).json({msg: "Registation completed"});
}
 });

router.route("/login").post(passport.authenticate('login'),
 function(req, res) {
    if(isAuthenticated) res.status(200).json({msg: "Log in completed"});
 });

router.route("/users/:userId")
.post(jwt({secret: "secret"}), controllers.utils.updateUser)
.get(jwt({secret: "secret"}), controllers.utils.getUser)
.delete(jwt({secret: "secret"}), controllers.utils.deleteUser);

router.route("/users/:userId/movies")
.post(jwt({secret: "secret"}), controllers.utils.addMovie)
.get(jwt({secret: "secret"}), controllers.utils.getAllUserMovies);

router.route("/users/:userId/movies/:movieId")
.post(jwt({secret: "secret"}), controllers.utils.updateMovie)
.get(jwt({secret: "secret"}), controllers.utils.getUserMovie)
.delete(jwt({secret: "secret"}), controllers.utils.deleteMovie);

router.route("/movies")
.get(controllers.utils.getAllMovies);

router.get("/", function(req, res) {
  res.render("index", { title: "Express" });
});

module.exports = router;
