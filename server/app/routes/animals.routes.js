module.exports = (app) => {
  const animals = require("../controllers/animals.controller.js");
  const { checkIfAuthenticated } = require("../auth/auth-middleware.js");

  var router = require("express").Router();

  // Create a new Animals
  router.post("/", checkIfAuthenticated, animals.create);

  // Retrieve all Animals
  router.get("/", checkIfAuthenticated, animals.findAll);

  // Retrieve a single Animals with id
  router.get("/:id", checkIfAuthenticated, animals.findOne);

  // Update a Animals with id
  router.put("/:id", checkIfAuthenticated, animals.update);

  // Delete a Animals with id
  router.delete("/:id", checkIfAuthenticated, animals.delete);

  // Delete all Animals
  router.delete("/", checkIfAuthenticated, animals.deleteAll);

  app.use("/animals", router);
};
