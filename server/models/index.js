var db = require('../db').db;
var Q = require('Q');

module.exports = {
  tweets: {
    get: function () {
      var deferred = Q.defer();
      db.query('Select \
        t.msg, \
        t.time, \
        u.name AS username, \
        r.name AS roomname \
        FROM \
        Tweets t JOIN Rooms r \
        ON t.roomID = r.ID JOIN Users u \
        ON t.userID = u.ID;',
        function(err, rows) {
          if (err) {deferred.reject(err);}
          deferred.resolve(rows);
        }
      );
      return deferred.promise;
    }, // a function which produces all the messages
    post: function (tweet) {
      var deferred = Q.defer();
      var userID = this.users.get(tweet.username);
      var roomID = this.users.get(tweet.roomname);
      var msg = tweet.message;

      db.query('INSERT INTO Tweets (roomID, userID, msg) VALUES (\'' + roomID + '\' \'' + userID + '\' \'' + msg + '\');',
        function(err){
          if(err){deffered.reject(err);}
          else{deffered.resolve();}
        }
      );
      return deferred.promise;
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (name) {
      var deferred = Q.defer();
      if (name) {
        db.query('SELECT ID FROM users WHERE name=\''+name+'\';',
          function(err, rows){
            if (err) {deferred.reject(err);}
            deferred.resolve(rows[0].ID);
          }
        );
      } else {
        db.query('SELECT name AS username, roomID, ID FROM Users',
          function(err, rows){
            if(err) {deferred.reject(err);}
            deferred.resolve(rows);
          }
        );
      }
      return deferred.promise;
    },
    post: function (username, roomname) {
      var deferred = Q.defer();
      var roomID = this.rooms.get(roomname);
      db.query('INSERT INTO Users (name, roomID) VALUES (\''+ username +'\', \''+ roomID +'\');',
        function(err) {
          if (err) {deferred.reject(err);}
          else {deferred.resolve();}
        }
      );
      return deferred.promise;
    }
  },

  rooms: {
    // Ditto as above.
    get: function (name) {
      var deferred = Q.defer();
      if(name){
        db.query('SELECT ID FROM rooms WHERE name=\''+name+'\';',
          function(err, rows){
            if (err) {deferred.reject(err);}
            deferred.resolve(rows[0].ID);
          }
        );
      }else{
        db.query('SELECT name AS roomname, ID FROM rooms',
          function(err, rows){
            if (err) {deferred.reject(err);}
            console.log('rooms', rows);
            deferred.resolve(rows);
          }
        );
      }
      return deferred.promise;
    },
    post: function (roomname) {
      var deferred = Q.defer();
      db.query('INSERT INTO rooms (name) values (\''+ roomname +'\');',
        function(err){
          if (err) {deferred.reject(err);}
          else {deferred.resolve();}
        }
      );
      return deferred.promise;
    }
  }
};

//module.exports.rooms.get();
//module.exports.users.get();
module.exports.tweets.get().then(
  function(tweets){console.log(tweets);
});
