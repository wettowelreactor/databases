var db = require('../db').db;
var Q = require('Q');

module.exports = {
  tweets: {
    get: function () {
      console.log('GET tweets called');
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
          if (err) {
            deferred.reject(err);
            return;
          }
          deferred.resolve(rows);
        }
      );
      return deferred.promise;
    },
    post: function (tweet) {
      console.log('POST tweets called');
      var deferred = Q.defer();
      var userID, roomID;
      var msg = tweet.message || '';

      module.exports.rooms.get(tweet.roomname)
        .then(function(id){
          if (id) {
            roomID = id;
            console.log("changed room Id")
            return;
          } else {
            return module.exports.rooms.post(tweet.roomname).then(function(){
              return module.exports.rooms.get(tweet.roomname);
            }).then(function(id){
              roomID = id;
              console.log("changed room Id")
            });
          }
        }).then(function(){
          return module.exports.users.get(tweet.username);
        }).then(function(id){
          if (id) {
            userID = id;
            console.log("changed user Id")

          } else {
            return module.exports.users.post(tweet.username, tweet.roomname).then(function(){
              return module.exports.users.get(tweet.username);
            }).then(function(id){
              userID = id;
              console.log("changed user Id")
            });
          }
        }).then(function () {
          console.log('about to query', roomID, userID);
          db.query('INSERT INTO Tweets (roomID, userID, msg) VALUES (\'' + roomID + '\', \'' + userID + '\', \'' + msg + '\');',
            function(err){
              if(err){
                deferred.reject(err);
                return;
              }
              else{deferred.resolve();}
            }
          );
        }, function (err) {console.log(err);});
      return deferred.promise;
    }
  },

  users: {
    get: function (name) {
      console.log('GET users called');
      var deferred = Q.defer();
      if (name) {
        db.query('SELECT ID FROM users WHERE name=\''+name+'\';',
          function(err, rows){
            if (err) {
              deferred.reject(err);
              return;
            }
            if (rows.length === 0) {
              deferred.resolve();
            } else {
              deferred.resolve(rows[0].ID);
            }
          }
        );
      } else {
        db.query('SELECT name AS username, roomID, ID FROM Users',
          function(err, rows){
            if(err) {
              deferred.reject(err);
              return;
            }
            deferred.resolve(rows);
          }
        );
      }
      return deferred.promise;
    },
    post: function (username, roomname) {
      console.log('POST users called');
      var deferred = Q.defer();
      module.exports.rooms.get(roomname).then(
        function(roomID){
          db.query('INSERT INTO Users (name, roomID) VALUES (\''+ username +'\', \''+ roomID +'\');',
            function(err) {
              if (err) {
                deferred.reject(err);
                return;
              }
              else {deferred.resolve();}
            }
          );
        }
      );
      return deferred.promise;
    }
  },

  rooms: {
    get: function (name) {
      console.log('GET rooms called');
      var deferred = Q.defer();
      if(name){
        db.query('SELECT ID FROM rooms WHERE name=\''+name+'\';',
          function(err, rows){
            if (err) {
              deferred.reject(err);
              return;
            }
            if (rows.length === 0) {
              deferred.resolve();
            } else {
              deferred.resolve(rows[0].ID);
            }
          }
        );
      }else{
        db.query('SELECT name AS roomname, ID FROM rooms',
          function(err, rows){
            if (err) {
              deferred.reject(err);
              return;
            }
            deferred.resolve(rows);
          }
        );
      }
      return deferred.promise;
    },
    post: function (roomname) {
      console.log('POST rooms called');
      var deferred = Q.defer();
      db.query('INSERT INTO rooms (name) values (\''+ roomname +'\');',
        function(err){
          if (err) {
            deferred.reject(err);
            return;
          }
          else {deferred.resolve();}
        }
      );
      return deferred.promise;
    }
  }
};

module.exports.tweets.post({
  tweet : "This is a post msg",
  username : 'isfgiadfv',
  roomname : 'dioyhojisrtg'
}).then(
  function(){
    console.log('first Promise');
    return module.exports.tweets.get();
  }
).then(
  function(tweets){console.log(tweets);},
  function(err){console.log(err);}
);
