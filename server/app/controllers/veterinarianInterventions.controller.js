const VeterinarianInterventions = require("../models/veterinarianInterventions.model.js");

// Create and Save a new VeterinarianInterventions
exports.create = (req, res) => {
  
};

// Retrieve all VeterinarianInterventions from the database (with condition).
exports.findAll = (req, res) => {
    const name = req.query.name;

    VeterinarianInterventions.getAll(name, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving host veterinarian interventions."
        });
      else res.send(data);
    });
};

// Find a single VeterinarianInterventions with a id
exports.findOne = (req, res) => {
  
};

// Update a VeterinarianInterventions identified by the id in the request
exports.update = (req, res) => {
  
};

// Delete a VeterinarianInterventions with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all VeterinarianInterventions from the database.
exports.deleteAll = (req, res) => {
  
};