var request = require('supertest');
var app = require('../app');
var logger = require('minilog')('usersTests');
var mongoose = require('mongoose');
var Auth = mongoose.model("Auth");
var Post = mongoose.model("Post");

    var testData = {
            username: 'user2',
            password: 'pass2'
    };
    var dbData = new Auth(testData);

        dbData.save(function (err, next) {
            if(err) return Error('error with user creation');
            logger.log("data send to database in userTest: " + next);
        });

    testData = {
        username: 'user3',
        password: 'pass3'
    };
    var dbData = new Auth(testData);

        dbData.save(function (err, next) {
            if(err) return Error('error with user creation');
            logger.log("data send to database in userTest: " + next);
        });

    testData = {
        username: 'user4',
        password: 'pass4'
    };
    var dbData = new Auth(testData);

        dbData.save(function (err, next) {
            if(err) return Error('error with user creation');
            logger.log("data send to database in userTest: " + next);
        });

    var testData = {
            title: 'title2',
            link: '',
            user: 'user2'
    };
    var dbData = new Post(testData);

        dbData.save(function (err, next) {
            if(err) return Error('error with user creation');
            logger.log("data send to posts in userTest: " + next);
        });

    var testData = {
            title: 'title2.2',
            link: '',
            user: 'user2'
    };
    var dbData = new Post(testData);

        dbData.save(function (err, next) {
            if(err) return Error('error with user creation');
            logger.log("data send to posts in userTest: " + next);
        });

    var testData = {
            title: 'title3',
            link: '',
            user: 'user3'
    };
    var dbData = new Post(testData);

        dbData.save(function (err, next) {
            if(err) return Error('error with user creation');
            logger.log("data send to posts in userTest: " + next);
        });

    var testData = {
            title: 'title4',
            link: '',
            user: 'user4'
    };
    var dbData = new Post(testData);

        dbData.save(function (err, next) {
            if(err) return Error('error with user creation');
            logger.log("data send to posts in userTest: " + next);
        });

describe('../controllers/utils/users', function () {
  it('shold return 200 response', function(done) {
    request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
        logger.log(res.body);
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
    });
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
            done();
        });
    });
});

//userId.js

    describe('userId Log in', function () {
        it('shold return 200 response when logged in', function(done) {
            request(app)
            .post('/login')
            .send({
                username: 'user2',
                password: 'pass2'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
            if (err) throw err;
            token = res.body.tokens;
            logger.log(res.body);
            done();
        });
        });
    });
    describe('userId Log in', function () {
        it('shold return 400 response with wrong credentials', function(done) {
            request(app)
            .post('/login')
            .send({
                username: 'user456',
                password: 'pass456'
            })
            .expect(400)
            .end(function(err, res){
            if (err) throw err;
            logger.log(res.body);
            done();
        });
        });
    });

    describe('get user', function () {
        it('should return 200 and get user', function (done) {
            request(app)
            .get("/users/:userId")
            .set({ 'Authorization': token })
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('update user', function () {
        it('should return 400 without an updated password', function (done) {
            request(app)
            .post("/users/:userId")
            .set({ 'Authorization': token })
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('update user2', function () {
        it('should return 200 and update user password', function (done) {
            request(app)
            .post("/users/:userId")
            .set({ 'Authorization': token })
            .send({ update: 'pass1234' })
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('fail to create a movie', function () {
        it('should return 400 because of missing title', function (done) {
            request(app)
            .post("/users/:userId/movies")
            .set({ 'Authorization': token })
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('create user2 movie', function () {
        it('should return 200 and create a user2 movie', function (done) {
            request(app)
            .post("/users/:userId/movies")
            .set({ 'Authorization': token })
            .send({
                title: 'title2.3',
                link: ''
                    })
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('get a user2 movie', function () {
        it('should return 200 and get a user2 movie', function (done) {
            request(app)
            .get("/users/:userId/movies/:movieId?title=title2")
            .set({ 'Authorization': token })
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('update movie', function () {
        it('should return 200 and updated title', function (done) {
            request(app)
            .post("/users/:userId/movies/:movieId")
            .set({ 'Authorization': token })
            .send({
                title: 'title2.2',
                update: 'title4567'})
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('fail to update movie', function () {
        it('should return 400 because there\'s no title', function (done) {
            request(app)
            .post("/users/:userId/movies/:movieId")
            .set({ 'Authorization': token })
            .send({update: 'title4567'})
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('fail to update movie', function () {
        it('should return 400 because there\'s no update', function (done) {
            request(app)
            .post("/users/:userId/movies/:movieId")
            .set({ 'Authorization': token })
            .send({title: 'title2'})
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('fail to delete movie', function () {
        it('should return 400, wrong title sent', function (done) {
            request(app)
            .delete("/users/:userId/movies/:movieId")
            .set({ 'Authorization': token })
            .send({
                title: 'title45678910'})
            .expect(400)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('delete movie', function () {
        it('should return 200 and delete a movie', function (done) {
            request(app)
            .delete("/users/:userId/movies/:movieId")
            .set({ 'Authorization': token })
            .send({
                title: 'title4567'})
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                done();
            });
        });
    });

    describe('get all user2 movies', function () {
        it('should return 200 and get all user2 movies', function (done) {
            request(app)
            .get("/users/:userId/movies")
            .set({ 'Authorization': token })
            .expect(200)
            .end(function (err, res) {
                logger.log(res.body);
                if (err) throw err;

                done();
            });
        });
    });


    describe('../controllers/utils/getAllMovies', function () {
      it('shold return 200 response', function(done) {
        request(app)
          .get('/movies')
          //.expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            logger.log(res.body);
            done();
        });
      });
    });

    describe('delete user2', function () {
        it('should return 200 and delete user2', function (done) {
            request(app)
            .delete("/users/:userId")
            .set({ 'Authorization': token })
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                logger.log(res.body);
                Auth.find().remove().exec();
                Post.find().remove().exec();
                done();
            });
        });
    });
