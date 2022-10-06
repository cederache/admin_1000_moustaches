const Species = require("../models/species.model.js");

// Create and Save a new Species
exports.create = (req, res) => {};

// Retrieve all Species from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;

  Species.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving species.",
      });
    else res.send(data);
  });
};

// Find a single Species with a id
exports.findOne = (req, res) => {};

// Update a Species identified by the id in the request
exports.update = (req, res) => {};

// Delete a Species with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Species from the database.
exports.deleteAll = (req, res) => {};
