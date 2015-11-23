var app = angular.module('movie', []);
app = angular.module('movie', ['ui.router']);
var jwttoken;

//videos factory
app.factory('posts', ['$http', function ($http) {
    var videos = {
        posts: []
    };
    videos.update = function (post) {
        return $http.post('/update', post).success(function (data) { 
            alert(data.msg);
            angular.copy(data.data, videos.posts);
        });
    };
    videos.remove = function (post) {
        return $http.post('/remove', post).success(function (data) {
            alert(data.msg);
            angular.copy(data.data, videos.posts);
        });
    };
    videos.getAll = function () {
        return $http.get('/users').success(function (data) {
            angular.copy(data, videos.posts);        
            });
            };

    videos.create = function (post) {
        return $http.post('/videos', post).success(function (data) {
            videos.posts.push(data);
        });
    };
    return videos;
} ]);

//auth factory
app.factory('auths', ['$http', function($http){
  var obj = {
    auths: []
    };
    obj.login = function(auth){
        return $http.post('/login', auth).error(function(data){
            alert(data.msg);
        });
      };
      obj.create = function(auth) {
          return $http.post('/users', auth).success(function(){
            alert('Register successful');
          });
    };
  return obj;
}]);

//controller for authentication
app.controller('AuthCtrl', [
'$scope',
'auths',
'$state',
'$http',
function($scope, auths, $state, $http){
    $scope.test= "testiranje da li radi";
    $scope.register = function () {
        auths.create({
            username: $scope.username,
            password: $scope.password
        }).error(function(data) {
            var errorMessage = data.msg;
            alert(errorMessage);
        });
    };

    $scope.LogOn = function () {
        auths.login({
			username: $scope.username,
            password: $scope.password
		}).success(function(data){
           $http.defaults.headers.common.Authorization = data.tokens;
           jwttoken = data.tokens;
           $state.go('log');
        });
    };

    $scope.logOff = function () {
        $state.go('home');
    };
}
]);

//controller for video manipulation
app.controller('MainCtrl', [
'$scope',
'posts',
function ($scope, posts) {
    $scope.test = 'testiranje';

    $scope.posts = posts.posts;

    $scope.addMovie = function () {
        if (!$scope.title || $scope.title === '') { return; }
        posts.create({
            title: $scope.title,
            link: $scope.link,
            upvotes: 0
        });
        $scope.title = '';
        $scope.link = '';
    };

    $scope.delMovie = function () {
        posts.remove({
            title: $scope.title2
        }).error(function (data) {
            alert(data.msg);
        });
    };

    $scope.upMovie = function () {
        posts.update({
            title: $scope.title2,
            update: $scope.update
        }).error(function (data) { 
            alert(data.msg);
        });
    };
} ]);

//state provider for log template
app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('log', {
      url: '/log',
      templateUrl: '/log.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
        return posts.getAll();
    }]
  }
})
  $urlRouterProvider.otherwise('log');
}]);

//state provider for home template
app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
        return posts.getAll();
    }]
  }
})
    
  $urlRouterProvider.otherwise('home');
}]);