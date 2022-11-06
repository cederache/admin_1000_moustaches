const HostFamilyKinds = require("../models/host_family_kinds.models.js");

// Create and Save a new HostFamilyKinds
exports.create = (req, res) => {
  res.status(200).send({});
};

// Retrieve all HostFamilyKinds from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  HostFamilyKinds.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving hostFamilyKinds.",
      });
    else res.send(data);
  });
};

// Find a single HostFamilyKinds with a id
exports.findOne = (req, res) => {
  const id = req.params.id;

  HostFamilyKinds.findById(id, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving hostFamilyKinds with id ${id}.`,
      });
    } else res.send(data);
  });
};

// Update a HostFamilyKinds identified by the id in the request
exports.update = (req, res) => {
  res.status(200).send({});
};

// Delete a HostFamilyKinds with the specified id in the request
exports.delete = (req, res) => {
  res.status(200).send({});
};

// Delete all HostFamilyKinds from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
