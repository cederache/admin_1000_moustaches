const HostFamilies = require("../models/hostFamilies.model.js");

// Create and Save a new HostFamilies
exports.create = (req, res) => {
  HostFamilies.create(req.body, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a host family.",
      });
    } else res.send(data);
  });
};

// Retrieve all HostFamilies from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  HostFamilies.getAll(name, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving host families.",
      });
    } else res.send(data);
  });
};

// Find a single HostFamilies with a id
exports.findOne = (req, res) => {
  const id = req.params.id;

  HostFamilies.findById(id, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving host family with id ${id}.`,
      });
    } else res.send(data);
  });
};

// Update a HostFamilies identified by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  HostFamilies.updateById(id, req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while updating host family with id ${id}.`,
      });
    else res.send(data);
  });
};

// Delete a HostFamilies with the specified id in the request
exports.delete = (req, res) => {
  res.status(200).send({});
};

// Delete all HostFamilies from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
