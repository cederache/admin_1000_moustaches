const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

var glob = require( 'glob' );
var path = require( 'path' );

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

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

glob.sync( './app/routes/**/*.js' ).forEach( function( file ) {
  require( path.resolve( file ) )(app);
});

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
