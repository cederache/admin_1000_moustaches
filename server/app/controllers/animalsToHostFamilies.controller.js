const AnimalsToHostFamilies = require("../models/animalsToHostFamilies.model.js");

// Create and Save a new AnimalsToHostFamilies
exports.create = (req, res) => {
  res.status(200).send({});
};

// Retrieve all AnimalsToHostFamilies from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  AnimalsToHostFamilies.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving host veterinarian interventions.",
      });
    else res.send(data);
  });
};

// Find a single AnimalsToHostFamilies with a id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AnimalsToHostFamilies.findById(id, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving animal to host family with id ${id}.`,
      });
    } else res.send(data);
  });
};

// Update a AnimalsToHostFamilies identified by the id in the request
exports.update = (req, res) => {
  res.status(200).send({});
};

// Delete a AnimalsToHostFamilies with the specified id in the request
exports.delete = (req, res) => {
  res.status(200).send({});
};

// Delete all AnimalsToHostFamilies from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
