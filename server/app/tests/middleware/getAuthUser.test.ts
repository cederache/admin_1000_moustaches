import { Request, Response, NextFunction } from 'express';
import { checkIfPermitted, Method } from '../../middlewares/permission-middleware';
import { Ressource as RessourceEnum } from '../../types/ressource';
import { UserController } from '../../controllers/UserController';
import * as UserControllerModule from '../../controllers/UserController';
import { Permission } from '../../models/Permission';
import { Ressource } from '../../models/Ressource';
import { Team } from '../../models/Team';
import { getAuthUser } from '../../middlewares/auth-middleware';
import { User } from '../../models/User';

//Mock express response
const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Mock controller
jest.mock('../../controllers/UserController');

describe('function getauthUser from auth middleware', () => {
    const mockUserController = UserController as jest.MockedClass<typeof UserController>;
    beforeEach(() => {
        jest.clearAllMocks(); // Nettoie entre chaque test
    });

    it('should return error 401 if not authmail', async () => {
        // Given
        const middleware = getAuthUser;
        const req = {
            authEmail: ''
        }
        const res = mockRes();
        const next = jest.fn();
        // When
        await middleware(req as Request, res, next);

        // Then
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ error: 'You are not authorized to make this request' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return error 404 if user not found', async () => {
        // Given
        jest.spyOn(UserControllerModule.UserController.prototype, 'getUserByEmail')
            .mockResolvedValue(null);
        const middleware = getAuthUser;
        const req = {
            authEmail: 'testcom@example.com',
        }
        const res = mockRes();
        const next = jest.fn();
        // When
        await middleware(req as Request, res, next);

        // Then
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ error: 'User not found' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return error authUser', async () => {

        const userFounded: User = {
            id: 1,
            name: 'Com',
            firstname: 'Issert',
            email: 'testcom@example.com',
            isReferent: false,
            hostFamilies: [],
            teams: [],
            createdAt: new Date(),
            updatedAt: new Date()

        }

        // Given
        jest.spyOn(UserControllerModule.UserController.prototype, 'getUserByEmail')
            .mockResolvedValue(userFounded);
        const middleware = getAuthUser;
        const req = {
            authEmail: 'testcom@example.com',
            authUser: undefined
        }
        const res = mockRes();
        const next = jest.fn();
        // When
        await middleware(req as Request, res, next);

        // Then
        expect(req.authUser).toBe(userFounded)
        expect(next).toHaveBeenCalled();
    });
});