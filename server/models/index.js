var db = require('../db').db;
module.exports = {
  tweets: {
    get: function () {
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
          if (err) {throw err;}
          console.log('tweets', rows);
          return rows;
        }
      );
    }, // a function which produces all the messages
    post: function (tweet) {
      var userID = this.users.get(tweet.username);
      var roomID = this.users.get(tweet.roomname);
      var msg = tweet.message;

      db.query('INSERT INTO Tweets (roomID, userID, msg) VALUES (\'' + roomID + '\' \'' + userID + '\' \'' + msg + '\');');
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (name) {
      if (name) {
        db.query('SELECT ID FROM users WHERE name=\''+name+'\';',
          function(err, rows){
            if (err) {throw err;}
            return rows[0].ID;
          }
        );
      } else {
        db.query('SELECT name AS username, roomID, ID FROM Users',
          function(err, rows){
            if(err) {throw err;}
            console.log('users', rows);
            return rows;
          }
        );
      }
    },
    post: function (username, roomname) {
      var roomID = this.rooms.get(roomname);
      db.query('INSERT INTO Users (name, roomID) VALUES (\''+ username +'\', \''+ roomID +'\');');
    }
  },

  rooms: {
    // Ditto as above.
    get: function (name) {
      if(name){
        db.query('SELECT ID FROM rooms WHERE name=\''+name+'\';',
          function(err, rows){
            if (err) {throw err;}
            return rows[0].ID;
          }
        );
      }else{
        db.query('SELECT name AS roomname, ID FROM rooms',
          function(err, rows){
            if (err) {throw err;}
            console.log('rooms', rows);
            return rows;
          }
        );
      }
    },
    post: function (roomname) {
      db.query('INSERT INTO rooms (name) values (\''+ roomname +'\');');
    }
  }
};

module.exports.rooms.get();
module.exports.users.get();
module.exports.tweets.get();
