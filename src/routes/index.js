var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var controllers = require('../controllers');

router.route('/users')
.post(controllers.utils.register)
.get(controllers.utils.getAllUsers);

router.route('/login').post(controllers.utils.logIn);

router.route('/users/:userId')
.post(jwt({secret: 'secret'}), controllers.utils.updateUser)
.get(jwt({secret: 'secret'}), controllers.utils.getUser)
.delete(jwt({secret: 'secret'}), controllers.utils.deleteUser);

router.route('/users/:userId/movies')
.post(jwt({secret: 'secret'}), controllers.utils.addMovie)
.get(jwt({secret: 'secret'}), controllers.utils.getAllUserMovies);

router.route('/users/:userId/movies/:movieId')
.post(jwt({secret: 'secret'}), controllers.utils.updateMovie)
.get(jwt({secret: 'secret'}), controllers.utils.getUserMovie)
.delete(jwt({secret: 'secret'}), controllers.utils.deleteMovie);

router.route('/movies')
.get(controllers.utils.getAllMovies);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

// Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWF0IjoxNDMzOTMzODM1fQ.Bl2PmPB36K2HjUaSNg1eeuOaZPYK1t966IN5A0mOykg

//Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIxMSIsImlhdCI6MTQzNDAxOTM2NH0.4WZ6d8QfFCKCFXslJitzmU147Ga4arPmIuu64WZMkbA