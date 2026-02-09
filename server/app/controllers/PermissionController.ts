import { Permission } from "../models/Permission";
import { AppDataSource } from "../config/database";

export class PermissionController {
  private permissionRepository = AppDataSource.getRepository(Permission);

  async getCurrentUserPermissions(userId: number) {
    const permissions = await this.permissionRepository.find({
      select: {
        create: true,
        read: true,
        update: true,
        delete: true,
        ressource: {
          name: true,
        },
      },
      relations: {
        team: false,
        ressource: true,
      },
      where: {
        team: {
          users: {
            id: userId,
          },
        },
      },
    });

    if (permissions.length === 0) {
      return [];
    }

    return permissions;
  }

  async getCurrentUserPermissionsWithRessource(userId: number, ressource: string) {
    const permissions = await this.permissionRepository.find({
      select: {
        create: true,
        read: true,
        update: true,
        delete: true,
        ressource: {
          name: true,
        },
      },
      relations: {
        team: false,
        ressource: true,
      },
      where: {
        team: {
          users: {
            id: userId,
          },
        },
        ressource: {
          name: ressource
        }
      },
    });

    if (permissions.length === 0) {
      return [];
    }

    return permissions;
  }
}
