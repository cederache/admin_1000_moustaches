const AnimalsToHostFamilies = require("../models/animalsToHostFamilies.model.js");

// Create and Save a new AnimalsToHostFamilies
exports.create = (req, res) => {
  
};

// Retrieve all AnimalsToHostFamilies from the database (with condition).
exports.findAll = (req, res) => {
    const name = req.query.name;

    AnimalsToHostFamilies.getAll(name, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving host veterinarian interventions."
        });
      else res.send(data);
    });
};

// Find a single AnimalsToHostFamilies with a id
exports.findOne = (req, res) => {
  
};

// Update a AnimalsToHostFamilies identified by the id in the request
exports.update = (req, res) => {
  
};

// Delete a AnimalsToHostFamilies with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all AnimalsToHostFamilies from the database.
exports.deleteAll = (req, res) => {
  
};