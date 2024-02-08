module.exports = (app) => {
  const users = require("../controllers/users.controller.js");
  const { checkIfAuthenticated } = require("../auth/auth-middleware.js");

  var router = require("express").Router();

  // Create a new Users
  router.post("/", checkIfAuthenticated, users.create);

  // Retrieve all Users
  router.get("/", checkIfAuthenticated, users.findAll);

  // Retrieve a single Users with id
  router.get("/:id", checkIfAuthenticated, users.findOne);

  // Update a Users with id
  router.put("/:id", checkIfAuthenticated, users.update);

  // Delete a Users with id
  router.delete("/:id", checkIfAuthenticated, users.delete);

  // Delete all Users
  router.delete("/", checkIfAuthenticated, users.deleteAll);

  app.use("/users", router);
};
