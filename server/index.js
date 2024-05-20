const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const functions = require("firebase-functions");
const { glob } = require("glob");
const path = require("path");
require("firebase-functions/logger/compat");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// Protection against well known vulnerabilities
app.use(helmet());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  // TODO: Add documentation here
  res.json({ message: "Welcome to 1000 moustaches admin application." });
});

// Load every js files
glob.sync("./app/routes/**/*.js").forEach(function (file) {
  require(path.resolve(file))(app);
});

// Expose the API as a function
exports.api = functions.https.onRequest(app);
