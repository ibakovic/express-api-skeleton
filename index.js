var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var controllers = require("./controllers");
var bodyParser = require('body-parser');
var app = express();

var jsonParser = bodyParser.json();
app.use(jsonParser);

//app.post("/users", jsonParser, controllers.utils.register);

router.route("/users")
.get(controllers.utils.getAllUsers)
.post(jsonParser, controllers.utils.register);

router.route("/login").post(controllers.utils.logIn);

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
