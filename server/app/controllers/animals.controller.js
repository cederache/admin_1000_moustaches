const Animals = require("../models/animals.model.js");

// Create and Save a new Animals
exports.create = (req, res) => {
  res.status(200).send({});
};

// Retrieve all Animals from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  Animals.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving animals.",
      });
    else res.send(data);
  });
};

// Find a single Animals with a id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Animals.findById(id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving animal with id ${id}.`,
      });
    else res.send(data);
  });
};

// Update a Animals identified by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Animals.updateById(id, req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while updating animal with id ${id}.`,
      });
    else res.send(data);
  });
};

// Delete a Animals with the specified id in the request
exports.delete = (req, res) => {
  res.status(200).send({});
};

// Delete all Animals from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
