'use strict';

const mysql = require('mysql');
// const error = require('chalk').white.bgRed.bold;

if(!process.env.MYSQL_PASSWORD) {
  throw err("Missing enviroment variable: MYSQL_PASSWORD")
}

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'messagedb'
});

db.connect();

module.exports = db;
