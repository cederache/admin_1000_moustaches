module.exports = (app) => {
  const hostFamilyKinds = require("../controllers/host_family_kinds.controller.js");
  const { checkIfAuthenticated } = require("../auth/auth-middleware.js");

  var router = require("express").Router();

  // Create a new HostFamilyKinds
  router.post("/", checkIfAuthenticated, hostFamilyKinds.create);

  // Retrieve all HostFamilyKinds
  router.get("/", checkIfAuthenticated, hostFamilyKinds.findAll);

  // Retrieve a single HostFamilyKinds with id
  router.get("/:id", checkIfAuthenticated, hostFamilyKinds.findOne);

  // Update a HostFamilyKinds with id
  router.put("/:id", checkIfAuthenticated, hostFamilyKinds.update);

  // Delete a HostFamilyKinds with id
  router.delete("/:id", checkIfAuthenticated, hostFamilyKinds.delete);

  // Delete all HostFamilyKinds
  router.delete("/", checkIfAuthenticated, hostFamilyKinds.deleteAll);

  app.use("/hostFamilyKinds", router);
};
