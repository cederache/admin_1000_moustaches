module.exports = (app) => {
  const veterinarianInterventions = require("../controllers/veterinarian_interventions.controller.js");

  var router = require("express").Router();

  // Create a new VeterinarianInterventions
  router.post("/", veterinarianInterventions.create);

  // Retrieve all VeterinarianInterventions
  router.get("/", veterinarianInterventions.findAll);

  // Retrieve all VeterinarianInterventions with animal_id
  router.get(
    "/withAnimalId/:id",
    veterinarianInterventions.findAllWithAnimalId
  );

  // Retrieve all VeterinarianInterventions with veterinarian_id
  router.get(
    "/withVeterinarianId/:id",
    veterinarianInterventions.findAllWithVeterinarianId
  );

  // Retrieve a single VeterinarianInterventions with id
  router.get("/:id", veterinarianInterventions.findOne);

  // Update a VeterinarianInterventions with id
  router.put("/:id", veterinarianInterventions.update);

  // Delete a VeterinarianInterventions with id
  router.delete("/:id", veterinarianInterventions.delete);

  // Delete all VeterinarianInterventions
  router.delete("/", veterinarianInterventions.deleteAll);

  app.use("/veterinarianInterventions", router);
};
