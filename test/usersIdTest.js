var request = require('supertest');
var app = require('../app');
var mongoose = require('mongoose');
var Auth = mongoose.model("Auth");
var token;
Auth.find().remove().exec();

/*var testData = {
        username: 'user2',
        password: 'pass2'
    };
    var dbData = new Auth(testData);

        dbData.save(function (err, next) { 
            if(err) return Error('error with user creation');
            console.log("data send to database: " + next);
        });

    testData = {
        username: 'user3',
        password: 'pass3'
    };
    var dbData = new Auth(testData);

        dbData.save(function (err, next) { 
            if(err) return Error('error with user creation');
            console.log("data send to database: " + next);
        });
    
    testData = {
        username: 'user4',
        password: 'pass4'
    };
    var dbData = new Auth(testData);

        dbData.save(function (err, next) { 
            if(err) return Error('error with user creation');
            console.log("data send to database: " + next);
        });
*/
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
            console.log(res.body);
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
            console.log(res.body);
            done();
        });
        });
    });

    describe('get user', function () {
        it('should return 200 and delete user', function (done) {
            request(app)
            .get("/users/:userId")
            .set({ 'Authorization': token })
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                console.log(res.body);
                //Auth.find().remove().exec();
                done();
            });
        });
    });
    