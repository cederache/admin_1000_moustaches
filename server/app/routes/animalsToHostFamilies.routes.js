module.exports = app => {
    const animalsToHostFamilies = require("../controllers/animalsToHostFamilies.controller.js");
  
    var router = require("express").Router();
  
    // Create a new AnimalsToHostFamilies
    router.post("/", animalsToHostFamilies.create);
  
    // Retrieve all AnimalsToHostFamilies
    router.get("/", animalsToHostFamilies.findAll);
  
    // Retrieve a single AnimalsToHostFamilies with id
    router.get("/:id", animalsToHostFamilies.findOne);
  
    // Update a AnimalsToHostFamilies with id
    router.put("/:id", animalsToHostFamilies.update);
  
    // Delete a AnimalsToHostFamilies with id
    router.delete("/:id", animalsToHostFamilies.delete);
  
    // Delete all AnimalsToHostFamilies
    router.delete("/", animalsToHostFamilies.deleteAll);
  
    app.use('/api/animalsToHostFamilies', router);
  };