const Species = require("../models/species.model.js");

// Create and Save a new Species
exports.create = (req, res) => {
  res.status(200).send({});
};

// Retrieve all Species from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  Species.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving species.",
      });
    else res.send(data);
  });
};

// Find a single Species with a id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Species.findById(id, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving species with id ${id}.`,
      });
    } else res.send(data);
  });
};

// Update a Species identified by the id in the request
exports.update = (req, res) => {
  res.status(200).send({});
};

// Delete a Species with the specified id in the request
exports.delete = (req, res) => {
  res.status(200).send({});
};

// Delete all Species from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
