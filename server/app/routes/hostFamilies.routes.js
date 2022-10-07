module.exports = (app) => {
  const hostFamilies = require("../controllers/hostFamilies.controller.js");

  var router = require("express").Router();

  // Create a new HostFamilies
  router.post("/", hostFamilies.create);

  // Retrieve all HostFamilies
  router.get("/", hostFamilies.findAll);

  // Retrieve a single HostFamilies with id
  router.get("/:id", hostFamilies.findOne);

  // Update a HostFamilies with id
  router.put("/:id", hostFamilies.update);

  // Delete a HostFamilies with id
  router.delete("/:id", hostFamilies.delete);

  // Delete all HostFamilies
  router.delete("/", hostFamilies.deleteAll);

  app.use("/api/hostFamilies", router);
};
