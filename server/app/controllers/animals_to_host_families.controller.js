const AnimalsToHostFamilies = require("../models/animals_to_host_families.model.js");

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
          "Some error occurred while retrieving animal to host families.",
      });
    else res.send(data);
  });
};

// Retrieve all AnimalsToHostFamilies from the database (with condition).
exports.findAllWithAnimalId = (req, res) => {
  const animalId = req.params.id;

  AnimalsToHostFamilies.getAllWithAnimalId(animalId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving animal to host families with animal id.",
      });
    else res.send(data);
  });
};

// Retrieve all AnimalsToHostFamilies from the database (with condition).
exports.findAllWithHostFamilyId = (req, res) => {
  const hostFamilyId = req.params.id;

  AnimalsToHostFamilies.getAllWithHostFamilyId(hostFamilyId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving animal to host families with animal id.",
      });
    else res.send(data);
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
