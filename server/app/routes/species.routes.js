module.exports = app => {
    const species = require("../controllers/species.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Species
    router.post("/", species.create);
  
    // Retrieve all Species
    router.get("/", species.findAll);
  
    // Retrieve a single Species with id
    router.get("/:id", species.findOne);
  
    // Update a Species with id
    router.put("/:id", species.update);
  
    // Delete a Species with id
    router.delete("/:id", species.delete);
  
    // Delete all Species
    router.delete("/", species.deleteAll);
  
    app.use('/api/species', router);
  };