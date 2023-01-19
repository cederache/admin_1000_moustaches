module.exports = (app) => {
  const animalsToHostFamilies = require("../controllers/animals_to_host_families.controller.js");

  const router = require("express").Router();

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
  router.put("/animalId/:aId/hostFamilyId/:hfId", animalsToHostFamilies.update);

  // Delete a AnimalsToHostFamilies with id
  router.delete(
    "/animalId/:aId/hostFamilyId/:hfId",
    animalsToHostFamilies.delete
  );

  // Delete all AnimalsToHostFamilies
  router.delete("/", animalsToHostFamilies.deleteAll);

  app.use("/animalsToHostFamilies", router);
};
