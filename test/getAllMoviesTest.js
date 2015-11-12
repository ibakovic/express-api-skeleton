var request = require('supertest');
var app = require('../app');

describe('../controllers/utils/getAllMovies', function () {
  it('shold return 200 response', function(done) {
    request(app)
      .get('/movies')
      //.expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
        done();
    });
  });

});
