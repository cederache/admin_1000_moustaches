const VeterinarianInterventions = require("../models/veterinarian_interventions.model.js");

// Create and Save a new VeterinarianInterventions
exports.create = (req, res) => {
  VeterinarianInterventions.create(req.body, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating a veterinarian intervention.",
      });
    } else res.send(data);
  });
};

// Retrieve all VeterinarianInterventions from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  VeterinarianInterventions.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving host veterinarian interventions.",
      });
    else res.send(data);
  });
};

// Retrieve all VeterinarianInterventions from the database (with condition).
exports.findAllWithAnimalId = (req, res) => {
  const animalId = req.params.id;

  VeterinarianInterventions.getAllWithAnimalId(animalId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving host veterinarian interventions with animalId.",
      });
    else res.send(data);
  });
};

// Retrieve all VeterinarianInterventions from the database (with condition).
exports.findAllWithVeterinarianId = (req, res) => {
  const veterinarianId = req.params.id;

  VeterinarianInterventions.getAllWithVeterinarianId(
    veterinarianId,
    (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving host veterinarian interventions with veterinarianId.",
        });
      else res.send(data);
    }
  );
};

// Find a single VeterinarianInterventions with a id
exports.findOne = (req, res) => {
  const id = req.params.id;

  VeterinarianInterventions.findById(id, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving veterinarian interventions with id ${id}.`,
      });
    } else res.send(data);
  });
};

// Update a VeterinarianInterventions identified by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  VeterinarianInterventions.updateById(id, req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while updating veterinarian intervention with id ${id}.`,
      });
    else res.send(data);
  });
};

// Delete a VeterinarianInterventions with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  VeterinarianInterventions.remove(id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while deleting veterinarian intervention with id ${id}.`,
      });
    else res.send(data);
  });
};

// Delete all VeterinarianInterventions from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
