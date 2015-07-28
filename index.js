var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var controllers = require("./controllers");

router.route("/users")
.post(controllers.utils.register)
.get(controllers.utils.getAllUsers);

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
