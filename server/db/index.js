var Promise = require("bluebird");
// Note that the library's classes are not properties of the main export
// so we require and promisifyAll them manually
//Promise.promisifyAll(require("mysql/lib/Connection").prototype);
//Promise.promisifyAll(require("mysql/lib/Pool").prototype);
var mysql = Promise.promisifyAll(require('mysql'));
//var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'chat'
});
connection.connect();

exports.db = connection;


// exports.db.query('Select t.msg, t.time, u.name as username, r.name as roomname \
//   from \
//   Tweets t join Rooms r on t.roomID = r.ID \
//   join Users u on t.userID = u.iD \
//   ;', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('full: ', err, rows);
// });


