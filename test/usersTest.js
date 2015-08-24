var request = require('supertest');
var app = require('../app');
var mongoose = require('mongoose');
var Auth = mongoose.model("Auth");
Auth.find().remove().exec();

    var testData = {
            username: 'user2',
            password: 'pass2'
    };
    var dbData = new Auth(testData);

        dbData.save(function (err, next) { 
            if(err) return Error('error with user creation');
            console.log("data send to database in userTest: " + next);
        });

    testData = {
        username: 'user3',
        password: 'pass3'
    };
    var dbData = new Auth(testData);

        dbData.save(function (err, next) { 
            if(err) return Error('error with user creation');
            console.log("data send to database in userTest: " + next);
        });
    
    testData = {
        username: 'user4',
        password: 'pass4'
    };
    var dbData = new Auth(testData);

        dbData.save(function (err, next) { 
            if(err) return Error('error with user creation');
            console.log("data send to database in userTest: " + next);
        });

describe('../controllers/utils/users', function () {
  it('shold return 200 response', function(done) {
    request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
        console.log(res.body);
        done();
    });
  });

});

describe('../controllers/utils/users no username and password', function () {
    it('should return 400 without username and password', function (done) {
        request(app)
        .post('/users')
        .expect(400)
        .end(function (err, res) { 
            if(err) throw err;
            done();
        });
    })
});

describe('../controllers/utils/users username already exists', function () {
    it('should return 400, username already exists', function (done) {
        request(app)
        .post('/users')
        .send({
            username: 'user2',
            password: 'pass2'
        })
        .expect(400)
        .end(function (err, res) { 
            if(err) throw err;
            done();
        });
    });
});

describe('../controllers/utils/users', function () {
    it('should return 200, registration succesfull', function (done) {
        request(app)
        .post('/users')
        .send({
            username: 'user123456789',
            password: 'pass123456789'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) { 
            if(err) throw err;
            //Auth.find().remove().exec();
            done();
        });
    });
});
