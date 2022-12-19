module.exports = (app) => {
  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  // Create a new Users
  router.post("/", users.create);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve a single Users with id
  router.get("/:id", users.findOne);

  // Update a Users with id
  router.put("/:id", users.update);

  // Delete a Users with id
  router.delete("/:id", users.delete);

  // Delete all Users
  router.delete("/", users.deleteAll);

  app.use("/users", router);
};
