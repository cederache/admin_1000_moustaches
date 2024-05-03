module.exports = (app) => {
  const species = require("../controllers/species.controller.js");
  const { checkIfAuthenticated } = require("../auth/auth-middleware.js");

  var router = require("express").Router();

  // Create a new Species
  router.post("/", checkIfAuthenticated, species.create);

  // Retrieve all Species
  router.get("/", checkIfAuthenticated, species.findAll);

  // Retrieve a single Species with id
  router.get("/:id", checkIfAuthenticated, species.findOne);

  // Update a Species with id
  router.put("/:id", checkIfAuthenticated, species.update);

  // Delete a Species with id
  router.delete("/:id", checkIfAuthenticated, species.delete);

  // Delete all Species
  router.delete("/", checkIfAuthenticated, species.deleteAll);

  app.use("/species", router);
};
