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

router.route("/users")
.get(controllers.utils.getAllUsers)
.post(passport.authenticate('register', {
	successRedirect: '/'
}),
 function(req, res) {
    res.status(200).json({msg: "Registation completed"});
 });

router.route("/login").post(passport.authenticate('login'),
    function(req, res) {
    	var token = "Bearer ";
        token += jwtoken.sign({
                    username: req.user.username
                },
                'secret',
                { expiresIn: 6000000000000000 });
        return res.status(200).json({user: req.user.username, token: token});
    }
 );

router.get("/", function(req, res) {
  res.render("index", { title: "Express" });
});

module.exports = router;
