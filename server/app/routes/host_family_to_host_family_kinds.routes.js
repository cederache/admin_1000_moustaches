module.exports = (app) => {
  const hostFamilyToHostFamilyKinds = require("../controllers/host_family_to_host_family_kinds.controller.js");

  var router = require("express").Router();

  // Create a new HostFamilyToHostFamilyKinds
  router.post("/", hostFamilyToHostFamilyKinds.create);

  // Retrieve all HostFamilyToHostFamilyKinds
  router.get("/", hostFamilyToHostFamilyKinds.findAll);

  // Retrieve all HostFamilies with HostFamilyKind id
  router.get(
    "/withHostFamilyKindId/:id",
    hostFamilyToHostFamilyKinds.findAllWithHostFamilyKindId
  );

  // Retrieve all HostFamilieKind with hostFamily id
  router.get(
    "/withHostFamilyId/:id",
    hostFamilyToHostFamilyKinds.findAllWithHostFamilyId
  );

  // Delete a HostFamilyToHostFamilyKinds with id
  router.delete(
    "/hostFamilyKind/:kindId/hostFamily/:hostFamilyId",
    hostFamilyToHostFamilyKinds.delete
  );

  app.use("/hostFamilyToHostFamilyKinds", router);
};
