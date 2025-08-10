import { Router } from "express";
import { PermissionController } from "../controllers/PermissionController";
import { checkIfAuthenticated, getAuthUser } from "../middlewares/auth-middleware";

const router = Router();
const permissionController = new PermissionController();

router.get("/", checkIfAuthenticated, getAuthUser, async (req, res) => {
  /* #swagger.tags = ['Permissions']
     #swagger.summary = 'Get current user permissions'
     #swagger.description = 'Retrieve all permissions for the currently authenticated user'
     #swagger.responses[200] = {
       description: 'List of user permissions',
       content: {
         'application/json': {
           schema: {
             type: 'array',
             items: { $ref: '#/components/schemas/Permission' }
           }
         }
       }
     }
     #swagger.responses[401] = { description: "Unauthorized" }
     #swagger.responses[404] = { description: "Not Found" }
  */
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
