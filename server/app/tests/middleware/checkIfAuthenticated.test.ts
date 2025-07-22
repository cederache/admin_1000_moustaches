import { Request, Response, NextFunction } from 'express';
import { checkIfAuthenticated } from '../../middlewares/auth-middleware';

//Mock express response
const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe('function checkIfAuthenticated from auth middleware', () => {

    it('should return 401 firebase', async () => {
        // Given
        const res = mockRes();
        const req = {
            headers: {
                authorization: "Bearer dsifjzoejfzeqilnvàéçjnvoervsl"
            },
            authToken: ''
        }
        const next = jest.fn();

        // When
        await checkIfAuthenticated(req as Request, res, next)

        // Then
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            error:
                "An error occured. You are not authorized to make this request"
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('should return 401 without token', async () => {
        // Given
        const res = mockRes();
        const req = {
            headers: {
                authorization: ""
            },
            authToken: ''
        }
        const next = jest.fn();

        // When
        await checkIfAuthenticated(req as Request, res, next)

        // Then
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            error:
                "You are not authorized to make this request"
        });
        expect(next).not.toHaveBeenCalled();
    });

});