var request = require('supertest');
var app = require('../app');
var errors = require('../views/errors');
console.log("app: " + app.get('/getAllMovies'));


describe('../controllers/utils/getAllMovies.js', function () {

  it('shold return 200 response', function(done) {
    request(app)
      .get('/getAllMovies')
      //.expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) throw errors();
        done();
    });
  });

});