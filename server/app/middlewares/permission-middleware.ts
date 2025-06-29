import { Request, Response, NextFunction } from 'express'
import { PermissionController } from '../controllers/PermissionController';

const permissionController = new PermissionController();
export enum Method { GET, POST, PUT, DELETE }

export const checkIfPermitted = (ressource: string, method: Method) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        let userId = req.authUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const permissions = await permissionController
            .getCurrentUserPermissionsWithRessource(userId, ressource)

        if (permissions.length === 0) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const permission = permissions[0]
        switch (method) {
            case Method.GET:
                if (!permission.read) {
                    return res.status(403).json({ message: "Forbidden" });
                };
            case Method.POST:
                if (!permission.create) {
                    return res.status(403).json({ message: "Forbidden" });
                };
            case Method.PUT:
                if (!permission.update) {
                    return res.status(403).json({ message: "Forbidden" });
                };
            case Method.DELETE:
                if (!permission.delete) {
                    return res.status(403).json({ message: "Forbidden" });
                };
        }
        next();

    }
};
