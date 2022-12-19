module.exports = (app) => {
  const hostFamilyKinds = require("../controllers/host_family_kinds.controller.js");

  var router = require("express").Router();

  // Create a new HostFamilyKinds
  router.post("/", hostFamilyKinds.create);

  // Retrieve all HostFamilyKinds
  router.get("/", hostFamilyKinds.findAll);

  // Retrieve a single HostFamilyKinds with id
  router.get("/:id", hostFamilyKinds.findOne);

  // Update a HostFamilyKinds with id
  router.put("/:id", hostFamilyKinds.update);

  // Delete a HostFamilyKinds with id
  router.delete("/:id", hostFamilyKinds.delete);

  // Delete all HostFamilyKinds
  router.delete("/", hostFamilyKinds.deleteAll);

  app.use("/hostFamilyKinds", router);
};
