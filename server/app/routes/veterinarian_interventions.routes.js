module.exports = (app) => {
  const veterinarianInterventions = require("../controllers/veterinarian_interventions.controller.js");
  const { checkIfAuthenticated } = require("../auth/auth-middleware.js");

  var router = require("express").Router();

  // Create a new VeterinarianInterventions
  router.post("/", checkIfAuthenticated, veterinarianInterventions.create);

  // Retrieve all VeterinarianInterventions
  router.get("/", checkIfAuthenticated, veterinarianInterventions.findAll);

  // Retrieve all VeterinarianInterventions with animal_id
  router.get(
    "/withAnimalId/:id",
    checkIfAuthenticated,
    veterinarianInterventions.findAllWithAnimalId
  );

  // Retrieve all VeterinarianInterventions with veterinarian_id
  router.get(
    "/withVeterinarianId/:id",
    checkIfAuthenticated,
    veterinarianInterventions.findAllWithVeterinarianId
  );

  // Retrieve a single VeterinarianInterventions with id
  router.get("/:id", checkIfAuthenticated, veterinarianInterventions.findOne);

  // Update a VeterinarianInterventions with id
  router.put("/:id", checkIfAuthenticated, veterinarianInterventions.update);

  // Delete a VeterinarianInterventions with id
  router.delete("/:id", checkIfAuthenticated, veterinarianInterventions.delete);

  // Delete all VeterinarianInterventions
  router.delete("/", checkIfAuthenticated, veterinarianInterventions.deleteAll);

  app.use("/veterinarianInterventions", router);
};
