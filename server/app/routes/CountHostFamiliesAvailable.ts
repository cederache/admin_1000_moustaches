import { Router } from "express";
import { HostFamilyController } from "../controllers/HostFamilyController";
import { checkIfAuthenticated } from "../auth/auth-middleware";

const router = Router();
const hostFamiliesCountController = new HostFamilyController();

router.get("/", checkIfAuthenticated, async (req, res) => {
  const hostFamiliesAvailable =
    await hostFamiliesCountController.getCountHostFamilyAvailable();
  res.json(hostFamiliesAvailable);
});

export default router;
