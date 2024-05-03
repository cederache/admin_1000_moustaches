module.exports = (app) => {
  const veterinarians = require("../controllers/veterinarians.controller.js");
  const { checkIfAuthenticated } = require("../auth/auth-middleware.js");

  var router = require("express").Router();

  // Create a new Veterinarians
  router.post("/", checkIfAuthenticated, veterinarians.create);

  // Retrieve all Veterinarians
  router.get("/", checkIfAuthenticated, veterinarians.findAll);

  // Retrieve a single Veterinarians with id
  router.get("/:id", checkIfAuthenticated, veterinarians.findOne);

  // Update a Veterinarians with id
  router.put("/:id", checkIfAuthenticated, veterinarians.update);

  // Delete a Veterinarians with id
  router.delete("/:id", checkIfAuthenticated, veterinarians.delete);

  // Delete all Veterinarians
  router.delete("/", checkIfAuthenticated, veterinarians.deleteAll);

  app.use("/veterinarians", router);
};
