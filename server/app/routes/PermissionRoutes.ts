import { Router } from "express";
import { PermissionController } from "../controllers/PermissionController";
import { checkIfAuthenticated, getAuthUser } from "../middlewares/auth-middleware";

const router = Router();
const permissionController = new PermissionController();

router.get("/", checkIfAuthenticated, getAuthUser, async (req, res) => {
  let userId = req.authUser.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const permissions = await permissionController
    .getCurrentUserPermissions(userId)
    .catch((error) => {
      console.error("Error fetching permission with userID", userId, error);
      return res.status(404).send({ error: "Error fetching permission" });
    });
  res.json(permissions);
});

export default router;
