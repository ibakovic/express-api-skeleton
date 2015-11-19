var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var controllers = require("./controllers");
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
var expressSession = require('express-session');
var passJwt = require('passport-jwt');
var jwtoken = require('jsonwebtoken');

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
	if (req.isAuthenticated()){

		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	//res.status(200).json({ msg: "You're good to go" });
};

router.route("/test")
.post(passport.authenticate('passJwt', { session: false}),
    function(req, res) {
    	res.status(200).json(req.user);
        //res.send(req.user.profile);
    });

router.route("/users")
.get(controllers.utils.getAllUsers)
.post(passport.authenticate('register', {
	successRedirect: '/'
}),
 function(req, res) {
    if(isAuthenticated) {
    res.status(200).json({msg: "Registation completed"});
}
 });

router.route("/login").post(passport.authenticate('login'),
    function(req, res) {
    	var token = "Bearer ";
        token += jwtoken.sign({
                    username: req.user.username
                },
                'secret');
        return res.status(200).json({user: req.user.username, token: token});
    }
 );

router.route("/users/:userId")
.all(isAuthenticated)
.post(controllers.utils.updateUser)
.get(controllers.utils.getUser)
.delete(controllers.utils.deleteUser);

router.route("/users/:userId/movies")
.all(isAuthenticated)
.post(controllers.utils.addMovie)
.get(controllers.utils.getAllUserMovies);

router.route("/users/:userId/movies/:movieId")
.all(isAuthenticated)
.post(controllers.utils.updateMovie)
.get(controllers.utils.getUserMovie)
.delete(controllers.utils.deleteMovie);

router.route("/movies")
.get(controllers.utils.getAllMovies);

router.get("/", function(req, res) {
  res.render("index", { title: "Express" });
});

module.exports = router;
