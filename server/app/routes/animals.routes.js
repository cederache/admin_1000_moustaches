module.exports = (app) => {
  const animals = require("../controllers/animals.controller.js");

  var router = require("express").Router();

  // Create a new Animals
  router.post("/", animals.create);

  // Retrieve all Animals
  router.get("/", animals.findAll);

  // Retrieve a single Animals with id
  router.get("/:id", animals.findOne);

  // Update a Animals with id
  router.put("/:id", animals.update);

  // Delete a Animals with id
  router.delete("/:id", animals.delete);

  // Delete all Animals
  router.delete("/", animals.deleteAll);

  app.use("/animals", router);
};
