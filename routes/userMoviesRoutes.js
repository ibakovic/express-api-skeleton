var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var controllers = require("../controllers");
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
//var expressSession = require('express-session');
var passJwt = require('passport-jwt');
var jwtoken = require('jsonwebtoken');

var jsonParser = bodyParser.json();
app.use(jsonParser);


var isAuthenticated = function(){
    return passport.authenticate('passJwt', { session: false});
};

router.use(isAuthenticated());

router.route("/users/:userId/movies")
.post(controllers.utils.addMovie)
.get(controllers.utils.getAllUserMovies);

router.route("/users/:userId/movies/:movieId")
.post(controllers.utils.updateMovie)
.get(controllers.utils.getUserMovie)
.delete(controllers.utils.deleteMovie);

module.exports = router;