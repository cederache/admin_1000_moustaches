module.exports = app => {
    const veterinarians = require("../controllers/veterinarians.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Veterinarians
    router.post("/", veterinarians.create);
  
    // Retrieve all Veterinarians
    router.get("/", veterinarians.findAll);
  
    // Retrieve a single Veterinarians with id
    router.get("/:id", veterinarians.findOne);
  
    // Update a Veterinarians with id
    router.put("/:id", veterinarians.update);
  
    // Delete a Veterinarians with id
    router.delete("/:id", veterinarians.delete);
  
    // Delete all Veterinarians
    router.delete("/", veterinarians.deleteAll);
  
    app.use('/api/veterinarians', router);
  };