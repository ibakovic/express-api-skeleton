var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var lodash = require('lodash');

$('document').ready(function() {
  $('#register').click(function() {
    $.post('/register', {
        username: $('#username').val(),
        password: $('#password').val()
      },
      function(data, status) {
        alert('Message: ' + data.msg + '\nStatus: ' + status);
    });
  });

  $('#login').click(function() {
    $.post('/login', {
        username: $('#username').val(),
        password: $('#password').val()
      },
      function(data, status) {
        alert('Data: ' + data.msg + '\nStatus: ' + status);
    });
  });

  var MovieModel = Backbone.Model.extend({
    url: '/movies'
  });

  var MovieCollection = Backbone.Collection.extend({
    model: MovieModel,
    url: '/movies'
  });

  var MovieView = Backbone.View.extend({
    el: $('#responseContainer'),

    events: {
      'click button#addMovie': 'addMovie'
    },

    initialize: function() {
      this.listenTo(this.collection, 'change', this.render);

      _.bindAll(this, 'render', 'appendMovies', 'addMovie');
      this.collection = new MovieCollection();
      this.collection.on('add', this.appendMovies);
      this.collection.fetch();
      this.render();
    },

    render: function() {
      var self = this;

      _(this.collection.models).each(function(item){
        self.appendItem(item);
      }, this);

      var insertTitle = '<input id="title" placeholder="Insert movie title here" /><br>';
      var insertLink = '<input id="link" placeholder="Insert movie link here" /><br>';
      var addMovie = '<button id="addMovie">Add <br>a movie</button><br><br><br<br><br>';

      $(this.el).append(insertTitle + insertLink + addMovie);
    },

    appendMovies: function(item){
      console.log('item', item);
      var self = this;
      item.get('data').forEach(function(movie) {
        console.log(movie);
        $(self.el).append('<li>Title: ' + movie.title + '<br>Added by:' + movie.addedBy + '<br><button class="deleteMovie">Delete</button></li><br>');
      });
    },

    appendItem: function(item){
      $('ul', this.el).append('<li>Title: ' + item.get('title') + '<br>Added by: ' + item.get('addedBy') + '<br><button class="deleteMovie">Delete</button></li><br>');
    },

    getCurrentUser: function() {
      var currentUser =  document.cookie.split('=');
      return currentUser[1];
    },

    addMovie: function() {
      var self = this;

      var movie = new MovieModel({
        title: $('#title').val(),
        link: $('#link').val(),
        addedBy: self.getCurrentUser()
      });
      //movie = lodash.invoke(movie, 'toObject');
      console.log(movie);
      movie.save();
      this.collection.off('add', this.appendMovies);
      this.collection.bind('add', this.appendItem);
      this.collection.add(movie);
      this.collection.off('add', this.appendItem);
      this.collection.on('add', this.appendMovies);
    }
  });

  var movieView = new MovieView();
});
