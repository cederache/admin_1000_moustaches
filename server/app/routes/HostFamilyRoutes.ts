import { Router } from "express";
import { HostFamilyController } from "../controllers/HostFamilyController";
import { checkIfAuthenticated, getAuthUser } from "../middlewares/auth-middleware";
import { checkIfPermitted, Method } from "../middlewares/permission-middleware";
import { Ressource } from "../types/ressource";

const router = Router();
const hostFamilyController = new HostFamilyController();

router.get("/", checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.HF_LIST, Method.GET), async (req, res) => {
  /* #swagger.tags = ['Host Families']
     #swagger.summary = 'Get all host families'
     #swagger.description = 'Retrieve a list of all host families with optional filtering'
     #swagger.parameters['kinds'] = {
       in: 'query',
       description: 'Filter by host family kinds (can be multiple)',
       required: false,
       schema: {
         type: 'array',
         items: { type: 'string' }
       }
     }
     #swagger.parameters['isAvailable'] = {
       in: 'query',
       description: 'Filter by availability status',
       required: false,
       type: 'boolean'
     }
     #swagger.responses[200] = {
       description: 'List of host families',
       content: {
         'application/json': {
           schema: {
             type: 'array',
             items: { $ref: '#/components/schemas/HostFamily' }
           }
         }
       }
     }
     #swagger.responses[401] = { description: "Unauthorized" }
     #swagger.responses[403] = { description: "Forbidden" }
  */
  const kindsParam = req.query.kinds;

  let kinds: string[] = [];

  if (Array.isArray(kindsParam)) {
    kinds = kindsParam.map((k) => String(k));
  } else if (kindsParam) {
    kinds = [String(kindsParam)];
  }

  const isAvailableParam = req.query.isAvailable;
  const isAvailable =
    isAvailableParam == "true"
      ? true
      : isAvailableParam == "false"
        ? false
        : undefined;

  const hostFamilies = await hostFamilyController.getAllHostFamilies({
    kinds,
    isAvailable,
  });
  res.json(hostFamilies);
});

router.get("/:id", checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.HF_LIST, Method.GET), async (req, res) => {
  /* #swagger.tags = ['Host Families']
     #swagger.summary = 'Get host family by ID'
     #swagger.description = 'Retrieve a specific host family by their ID'
     #swagger.parameters['id'] = {
       in: 'path',
       description: 'Host family ID',
       required: true,
       type: 'integer'
     }
     #swagger.responses[200] = {
       description: 'Host family details',
       schema: { $ref: '#/components/schemas/HostFamily' }
     }
     #swagger.responses[404] = { description: "Not Found" }
     #swagger.responses[401] = { description: "Unauthorized" }
     #swagger.responses[403] = { description: "Forbidden" }
  */
  const hostFamily = await hostFamilyController.getHostFamilyById(
    parseInt(req.params.id)
  );
  if (!hostFamily) {
    return res.status(404).json({ message: "Host family not found" });
  }
  res.json(hostFamily);
});

router.post("/", checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.HF_LIST, Method.POST), async (req, res) => {
  /* #swagger.tags = ['Host Families']
     #swagger.summary = 'Create new host family'
     #swagger.description = 'Register a new host family in the system'
     #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { $ref: '#/components/schemas/CreateHostFamilyRequest' }
         }
       }
     }
     #swagger.responses[201] = {
       description: 'Host family created successfully',
       schema: { $ref: '#/components/schemas/HostFamily' }
     }
     #swagger.responses[400] = { description: "Bad Request" }
     #swagger.responses[401] = { description: "Unauthorized" }
     #swagger.responses[403] = { description: "Forbidden" }
  */
  const newHostFamily = await hostFamilyController.createHostFamily(req.body);
  res.status(201).json(newHostFamily);
});

router.put("/:id", checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.HF_CONTACT, Method.PUT), async (req, res) => {
  /* #swagger.tags = ['Host Families']
     #swagger.summary = 'Update host family'
     #swagger.description = 'Update an existing host family\'s information'
     #swagger.parameters['id'] = {
       in: 'path',
       description: 'Host family ID',
       required: true,
       type: 'integer'
     }
     #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { $ref: '#/components/schemas/CreateHostFamilyRequest' }
         }
       }
     }
     #swagger.responses[200] = {
       description: 'Host family updated successfully',
       schema: { $ref: '#/components/schemas/HostFamily' }
     }
     #swagger.responses[404] = { description: "Not Found" }
     #swagger.responses[400] = { description: "Bad Request" }
     #swagger.responses[401] = { description: "Unauthorized" }
     #swagger.responses[403] = { description: "Forbidden" }
  */
  const updatedHostFamily = await hostFamilyController.updateHostFamily(
    parseInt(req.params.id),
    req.body
  );
  if (!updatedHostFamily) {
    return res.status(404).json({ message: "Host family not found" });
  }
  res.json(updatedHostFamily);
});

router.delete("/:id", checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.HF_LIST, Method.DELETE), async (req, res) => {
  /* #swagger.tags = ['Host Families']
     #swagger.summary = 'Delete host family'
     #swagger.description = 'Remove a host family from the system'
     #swagger.parameters['id'] = {
       in: 'path',
       description: 'Host family ID',
       required: true,
       type: 'integer'
     }
     #swagger.responses[204] = { description: 'Host family deleted successfully' }
     #swagger.responses[404] = { description: "Not Found" }
     #swagger.responses[401] = { description: "Unauthorized" }
     #swagger.responses[403] = { description: "Forbidden" }
  */
  await hostFamilyController.deleteHostFamily(parseInt(req.params.id));
  res.status(204).send();
});

export default router;
