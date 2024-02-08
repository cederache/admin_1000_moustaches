module.exports = (app) => {
  const hostFamilyToHostFamilyKinds = require("../controllers/host_family_to_host_family_kinds.controller.js");
  const { checkIfAuthenticated } = require("../auth/auth-middleware.js");

  var router = require("express").Router();

  // Create a new HostFamilyToHostFamilyKinds
  router.post("/", checkIfAuthenticated, hostFamilyToHostFamilyKinds.create);

  // Retrieve all HostFamilyToHostFamilyKinds
  router.get("/", checkIfAuthenticated, hostFamilyToHostFamilyKinds.findAll);

  // Retrieve all HostFamilies with HostFamilyKind id
  router.get(
    "/withHostFamilyKindId/:id",
    checkIfAuthenticated,
    hostFamilyToHostFamilyKinds.findAllWithHostFamilyKindId
  );

  // Retrieve all HostFamilieKind with hostFamily id
  router.get(
    "/withHostFamilyId/:id",
    checkIfAuthenticated,
    hostFamilyToHostFamilyKinds.findAllWithHostFamilyId
  );

  // Delete a HostFamilyToHostFamilyKinds with id
  router.delete(
    "/hostFamilyKind/:kindId/hostFamily/:hostFamilyId",
    checkIfAuthenticated,
    hostFamilyToHostFamilyKinds.delete
  );

  app.use("/hostFamilyToHostFamilyKinds", router);
};
