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

router.route("/users/:userId")
.post(controllers.utils.updateUser)
.get(controllers.utils.getUser)
.delete(controllers.utils.deleteUser);

module.exports = router;
