var models = require('../models');
var bluebird = require('bluebird');



module.exports = {
  tweets: {
    get: function (req, res) {
      models.tweets.get().then(function(tweets){
        res.send(tweets); //clean up db response
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.tweets.post(/*h=gettweet*/).then(function(){
        res.send(/*tweet*/);
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get().then(function(users){
        res.send(users); //cleanup users
      });
    },
    post: function (req, res) {
      models.users.post(/*get username*/).then(function(){
        res.send(/*username*/);
      });
    }
  },

  rooms: {
    get: function (req, res) {
      models.rooms.get().then(function(rooms){
        res.send(rooms); //cleanup rooms
      });
    },
    post: function (req, res) {
      models.rooms.post(/*roomname*/).then(function(){
        res.send(/*roomname*/);
      });
    }
  }
};

