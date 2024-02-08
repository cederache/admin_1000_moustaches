module.exports = (app) => {
  const hostFamilies = require("../controllers/host_families.controller.js");
  const { checkIfAuthenticated } = require("../auth/auth-middleware.js");

  var router = require("express").Router();

  // Create a new HostFamilies
  router.post("/", checkIfAuthenticated, hostFamilies.create);

  // Retrieve all HostFamilies
  router.get("/", checkIfAuthenticated, hostFamilies.findAll);

  // Retrieve a single HostFamilies with id
  router.get("/:id", checkIfAuthenticated, hostFamilies.findOne);

  // Update a HostFamilies with id
  router.put("/:id", checkIfAuthenticated, hostFamilies.update);

  // Delete a HostFamilies with id
  router.delete("/:id", checkIfAuthenticated, hostFamilies.delete);

  // Delete all HostFamilies
  router.delete("/", checkIfAuthenticated, hostFamilies.deleteAll);

  app.use("/hostFamilies", router);
};
