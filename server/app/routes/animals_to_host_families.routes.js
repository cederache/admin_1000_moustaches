module.exports = (app) => {
  const animalsToHostFamilies = require("../controllers/animals_to_host_families.controller.js");
  const { checkIfAuthenticated } = require("../auth/auth-middleware.js");

  const router = require("express").Router();

  // Create a new AnimalsToHostFamilies
  router.post("/", checkIfAuthenticated, animalsToHostFamilies.create);

  // Retrieve all AnimalsToHostFamilies
  router.get("/", checkIfAuthenticated, animalsToHostFamilies.findAll);

  // Retrieve all HostFamilies with animal id
  router.get(
    "/withAnimalId/:id",
    checkIfAuthenticated,
    animalsToHostFamilies.findAllWithAnimalId
  );

  // Retrieve all HostFamilies with hostFamily id
  router.get(
    "/withHostFamilyId/:id",
    checkIfAuthenticated,
    animalsToHostFamilies.findAllWithHostFamilyId
  );

  // Update a AnimalsToHostFamilies with id
  router.put(
    "/animalId/:aId/hostFamilyId/:hfId",
    checkIfAuthenticated,
    animalsToHostFamilies.update
  );

  // Delete a AnimalsToHostFamilies with id
  router.delete(
    "/animalId/:aId/hostFamilyId/:hfId",
    checkIfAuthenticated,
    animalsToHostFamilies.delete
  );

  // Delete all AnimalsToHostFamilies
  router.delete("/", checkIfAuthenticated, animalsToHostFamilies.deleteAll);

  app.use("/animalsToHostFamilies", router);
};
