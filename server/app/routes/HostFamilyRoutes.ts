import { Router } from "express";
import { HostFamilyController } from "../controllers/HostFamilyController";
import { checkIfAuthenticated } from "../auth/auth-middleware";

const router = Router();
const hostFamilyController = new HostFamilyController();

router.get("/", checkIfAuthenticated, async (req, res) => {
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

router.get("/:id", checkIfAuthenticated, async (req, res) => {
  const hostFamily = await hostFamilyController.getHostFamilyById(
    parseInt(req.params.id)
  );
  if (!hostFamily) {
    return res.status(404).json({ message: "Host family not found" });
  }
  res.json(hostFamily);
});

router.post("/", checkIfAuthenticated, async (req, res) => {
  const newHostFamily = await hostFamilyController.createHostFamily(req.body);
  res.status(201).json(newHostFamily);
});

router.put("/:id", checkIfAuthenticated, async (req, res) => {
  const updatedHostFamily = await hostFamilyController.updateHostFamily(
    parseInt(req.params.id),
    req.body
  );
  if (!updatedHostFamily) {
    return res.status(404).json({ message: "Host family not found" });
  }
  res.json(updatedHostFamily);
});

router.delete("/:id", checkIfAuthenticated, async (req, res) => {
  await hostFamilyController.deleteHostFamily(parseInt(req.params.id));
  res.status(204).send();
});

export default router;
