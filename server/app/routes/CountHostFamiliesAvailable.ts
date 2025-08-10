import { Router } from "express";
import { HostFamilyController } from "../controllers/HostFamilyController";
import { checkIfAuthenticated } from "../middlewares/auth-middleware";

const router = Router();
const hostFamiliesCountController = new HostFamilyController();

router.get("/", checkIfAuthenticated, async (req, res) => {
  /* #swagger.tags = ['Statistics']
     #swagger.summary = 'Get count of available host families'
     #swagger.description = 'Retrieve the total number of host families that are currently available'
     #swagger.responses[200] = {
       description: 'Count of available host families',
       schema: { $ref: '#/components/schemas/CountResponse' }
     }
     #swagger.responses[401] = { description: "Unauthorized" }
  */
  const hostFamiliesAvailable =
    await hostFamiliesCountController.getCountHostFamilyAvailable();
  res.json(hostFamiliesAvailable);
});

export default router;
