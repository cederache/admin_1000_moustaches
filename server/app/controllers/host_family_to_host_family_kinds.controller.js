const HostFamilyToHostFamilyKinds = require("../models/host_family_to_host_family_kinds.model.js");

// Create and Save a new HostFamilyToHostFamilyKinds
exports.create = (req, res) => {
  const host_family_id = req.body.host_family_id;
  const host_family_kind_id = req.body.host_family_kind_id;

  HostFamilyToHostFamilyKinds.create(
    {
      host_family_id: host_family_id,
      host_family_kind_id: host_family_kind_id,
    },
    (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating hostFamilyToHostFamilyKinds.",
        });
      else res.send(data);
    }
  );
};

// Retrieve all HostFamilyToHostFamilyKinds from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  HostFamilyToHostFamilyKinds.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving hostFamilyToHostFamilyKinds.",
      });
    else res.send(data);
  });
};

// Retrieve all HostFamilies from the database (with condition).
exports.findAllWithHostFamilyKindId = (req, res) => {
  const hostFamilyKindId = req.params.id;

  HostFamilyToHostFamilyKinds.getAllWithHostFamilyKindId(
    hostFamilyKindId,
    (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving host families with host family kind id.",
        });
      else res.send(data);
    }
  );
};

// Retrieve all HostFamilyKinds from the database (with condition).
exports.findAllWithHostFamilyId = (req, res) => {
  const hostFamilyId = req.params.id;

  HostFamilyToHostFamilyKinds.getAllWithHostFamilyId(
    hostFamilyId,
    (err, data) => {
      console.log("findAllWithHostFamilyId", data);
      if (err)
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving host family kind with host family id.",
        });
      else res.send(data);
    }
  );
};

// Find a single HostFamilyToHostFamilyKinds with a id
exports.findOne = (req, res) => {
  const id = req.params.id;

  HostFamilyToHostFamilyKinds.findById(id, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving hostFamilyToHostFamilyKinds with id ${id}.`,
      });
    } else res.send(data);
  });
};

// Update a HostFamilyToHostFamilyKinds identified by the id in the request
exports.update = (req, res) => {
  res.status(200).send({});
};

// Delete a HostFamilyToHostFamilyKinds with the specified id in the request
exports.delete = (req, res) => {
  const kindId = req.params.kindId;
  const hostFamilyId = req.params.hostFamilyId;

  HostFamilyToHostFamilyKinds.remove(
    { host_family_kind_id: kindId, host_family_id: hostFamilyId },
    (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message ||
            `Some error occurred while deleting hostFamilyToHostFamilyKinds with ids ${kindId} ${hostFamilyId}.`,
        });
      } else res.send(data);
    }
  );
};

// Delete all HostFamilyToHostFamilyKinds from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
