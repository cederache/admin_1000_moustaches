import { Request, Response, NextFunction } from 'express';
import { checkIfPermitted, Method } from '../../middlewares/permission-middleware';
import { Ressource as RessourceEnum } from '../../types/ressource';
import { PermissionController } from '../../controllers/PermissionController';
import * as PermissionControllerModule from '../../controllers/PermissionController';
import { Permission } from '../../models/Permission';
import { Ressource } from '../../models/Ressource';
import { Team } from '../../models/Team';

//Mock express response
const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Mock controller
jest.mock('../../controllers/PermissionController');

describe('function checkIfPermitted from permission middleware', () => {
    const mockPermissionController = PermissionController as jest.MockedClass<typeof PermissionController>;
    beforeEach(() => {
        jest.clearAllMocks(); // Nettoie entre chaque test
    });

    it('should return error 401 if no user is connected', async () => {
        // Given
        const middleware = checkIfPermitted(RessourceEnum.CARD_ANIMALS_ADOPTED, Method.GET);
        const req = { authUser: null } as Request;
        const res = mockRes();
        const next = jest.fn();
        // When
        await middleware(req, res, next);

        // Then
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return error 403 if no permission is found for ressource', async () => {
        // Given
        jest.spyOn(PermissionControllerModule.PermissionController.prototype, 'getCurrentUserPermissionsWithRessource')
            .mockResolvedValue([]);
        const middleware = checkIfPermitted(RessourceEnum.CARD_ANIMALS_ADOPTED, Method.GET);
        const req = { authUser: { id: 23 } } as unknown as Request;
        const res = mockRes();
        const next = jest.fn();

        // When
        await middleware(req, res, next);

        // Then
        expect(mockPermissionController.prototype.getCurrentUserPermissionsWithRessource)
            .toHaveBeenCalledWith(23, RessourceEnum.CARD_ANIMALS_ADOPTED);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    })

    it('should execute next() if permission exist', async () => {
        // Given
        const resolvedRessource: Ressource = {
            id: 1,
            name: RessourceEnum.CARD_ANIMALS_ADOPTED,
            permissions: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const resolvedTeam: Team = {
            id: 1,
            name: '',
            users: [],
            permissions: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const resolvedPermission: Permission = {
            id: 1,
            read: true,
            create: false,
            update: false,
            delete: false,
            ressource: resolvedRessource,
            team: resolvedTeam,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        jest.spyOn(PermissionControllerModule.PermissionController.prototype, 'getCurrentUserPermissionsWithRessource')
            .mockResolvedValue([
                resolvedPermission
            ]);
        const middleware = checkIfPermitted(RessourceEnum.CARD_ANIMALS_ADOPTED, Method.GET);
        const req = { authUser: { id: 23 } } as unknown as Request;
        const res = mockRes();
        const next = jest.fn();

        // When
        await middleware(req, res, next);

        // Then
        expect(mockPermissionController.prototype.getCurrentUserPermissionsWithRessource)
            .toHaveBeenCalledWith(23, RessourceEnum.CARD_ANIMALS_ADOPTED);
        expect(next).toHaveBeenCalled();
    })

});