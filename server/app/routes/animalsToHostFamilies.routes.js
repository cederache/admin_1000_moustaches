module.exports = (app) => {
  const animalsToHostFamilies = require("../controllers/animalsToHostFamilies.controller.js");

  var router = require("express").Router();

  // Create a new AnimalsToHostFamilies
  router.post("/", animalsToHostFamilies.create);

  // Retrieve all AnimalsToHostFamilies
  router.get("/", animalsToHostFamilies.findAll);

  // Retrieve all HostFamilies with animal id
  router.get("/withAnimalId/:id", animalsToHostFamilies.findAllWithAnimalId);

  // Retrieve all HostFamilies with hostFamily id
  router.get(
    "/withHostFamilyId/:id",
    animalsToHostFamilies.findAllWithHostFamilyId
  );

  // Update a AnimalsToHostFamilies with id
  router.put("/:id", animalsToHostFamilies.update);

  // Delete a AnimalsToHostFamilies with id
  router.delete("/:id", animalsToHostFamilies.delete);

  // Delete all AnimalsToHostFamilies
  router.delete("/", animalsToHostFamilies.deleteAll);

  app.use("/animalsToHostFamilies", router);
};
