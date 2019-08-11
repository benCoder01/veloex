const mysql = require("mysql");
const config = require('config');

console.log(config.get("db.database"))

exports.connection = mysql.createConnection({
  host: config.get("db.host"),
  port: config.get("db.port"),
  user: config.get("db.user"),
  password: process.env.DB_PASSWORD,
  database: config.get("db.database")
});
