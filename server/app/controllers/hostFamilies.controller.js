const HostFamilies = require("../models/hostFamilies.model.js");

// Create and Save a new HostFamilies
exports.create = (req, res) => {};

// Retrieve all HostFamilies from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;

  HostFamilies.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving host families.",
      });
    else res.send(data);
  });
};

// Find a single HostFamilies with a id
exports.findOne = (req, res) => {};

// Update a HostFamilies identified by the id in the request
exports.update = (req, res) => {};

// Delete a HostFamilies with the specified id in the request
exports.delete = (req, res) => {};

// Delete all HostFamilies from the database.
exports.deleteAll = (req, res) => {};
