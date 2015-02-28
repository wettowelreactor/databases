DROP DATABASE chat;
CREATE DATABASE chat;

USE chat;

CREATE TABLE tweets (
  ID int NOT NULL auto_increment,
  roomID int,
  userID int,
  msg varchar(140),
  time timestamp default current_timestamp,
  PRIMARY KEY (ID)
);
CREATE TABLE users (
  ID int NOT NULL auto_increment,
  roomID int,
  name varchar(16) default 'anon',
  PRIMARY KEY (ID)
);

CREATE TABLE rooms (
  ID int NOT NULL auto_increment,
  name varchar(16) default 'lobby',
  PRIMARY KEY (ID)
);

INSERT INTO users (roomID, name) values (1, 'bob'), (1, 'alice'), (2, 'rick');
INSERT INTO users (roomID) values (1);
INSERT INTO rooms () values ();
INSERT INTO rooms (name) values ('secret Room'), ('8th Floor');
INSERT INTO tweets (roomID, userID, msg) values (1, 1, 'This is bob'), (1, 2, 'this is alice'), (2, 1, 'Bob has left'), (1, 4, 'spy');

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

