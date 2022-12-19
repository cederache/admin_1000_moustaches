const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

const connect = (callback) => {
  // Create a connection to the database
  const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port: dbConfig.PORT || 3306,
    connectTimeout: 1000,
    timeout: 1000,
  });

  // open the MySQL connection
  connection.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");

    callback(connection);
  });
};

module.exports = { connect };
