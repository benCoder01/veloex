var mysql = require("mysql");

exports.connection = mysql.createConnection({
  host: "mariadb",
  port: "3306",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
