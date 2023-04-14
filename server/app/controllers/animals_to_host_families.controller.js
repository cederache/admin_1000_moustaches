const AnimalsToHostFamilies = require("../models/animals_to_host_families.model.js");

// Create and Save a new AnimalsToHostFamilies
exports.create = (req, res) => {
  AnimalsToHostFamilies.create(req.body, (err, data) => {
    if (err) {
      if (res.kind == "not_found") {
        res.status(404).send({
          message: "Not found",
        });
      } else {
        res.status(500).send({
          message:
            err.message ||
            "Some error occured while creating animal to host family",
        });
      }
    } else res.send(data);
  });
};

// Retrieve all AnimalsToHostFamilies from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  AnimalsToHostFamilies.getAll(name, (err, data) => {
    if (err) {
      if (res.kind == "not_found") {
        res.status(404).send({
          message: "Not found",
        });
      } else {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving animal to host families.",
        });
      }
    } else res.send(data);
  });
};

// Retrieve all AnimalsToHostFamilies from the database (with condition).
exports.findAllWithAnimalId = (req, res) => {
  const animalId = req.params.id;

  AnimalsToHostFamilies.getAllWithAnimalId(animalId, (err, data) => {
    if (err) {
      if (res.kind == "not_found") {
        res.status(404).send({
          message: "Not found",
        });
      } else {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving animal to host families with animal id.",
        });
      }
    } else res.send(data);
  });
};

// Retrieve all AnimalsToHostFamilies from the database (with condition).
exports.findAllWithHostFamilyId = (req, res) => {
  const hostFamilyId = req.params.id;

  AnimalsToHostFamilies.getAllWithHostFamilyId(hostFamilyId, (err, data) => {
    if (err) {
      if (res.kind == "not_found") {
        res.status(404).send({
          message: "Not found",
        });
      } else {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving animal to host families with animal id.",
        });
      }
    } else res.send(data);
  });
};

// Update a AnimalsToHostFamilies identified by the id in the request
exports.update = (req, res) => {
  AnimalsToHostFamilies.update(req.body, (err, data) => {
    if (err) {
      if (res.kind == "not_found") {
        res.status(404).send({
          message: "Not found",
        });
      } else {
        res.status(500).send({
          message:
            err.message ||
            "Some error occured while updating animal to host family",
        });
      }
    } else res.send(data);
  });
};

// Delete a AnimalsToHostFamilies with the specified id in the request
exports.delete = (req, res) => {
  AnimalsToHostFamilies.remove(
    req.params.aId,
    req.params.hfId,
    (err, data) => {
      if (err) {
        if (res.kind == "not_found") {
          res.status(404).send({
            message: "Not found",
          });
        } else {
          console.error(err);
          res.status(500).send({
            message:
              err.message ||
              "Some error occured while deleting animal to host family",
          });
        }
      } else res.send(data);
    }
  );
};

// Delete all AnimalsToHostFamilies from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
