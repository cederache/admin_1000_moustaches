import { Request, Response, NextFunction } from 'express';
import { getAuthToken } from '../../middlewares/auth-middleware';

//Mock express response
const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe('function getAuthtoken from auth middleware', () => {

    it('should return a token', async () => {
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
        getAuthToken(req as Request, res, next)

        // Then
        expect(req.authToken).toBe("dsifjzoejfzeqilnvàéçjnvoervsl");
        expect(next).toHaveBeenCalled();
    })

    it('should return No token found', async () => {
        // Given
        const res = mockRes();
        const req = {
            headers: {
                authorization: "dgdgdgdfereysghsd"
            },
            authToken: ''
        }
        const next = jest.fn();

        // When
        getAuthToken(req as Request, res, next)

        // Then
        expect(req.authToken).toBe(undefined);
        expect(next).toHaveBeenCalled();
    })

    it('should return No token found with authorization undefined', async () => {
        // Given
        const res = mockRes();
        const req = {
            headers: {
                authorization: undefined
            },
            authToken: ''
        }
        const next = jest.fn();

        // When
        getAuthToken(req as Request, res, next)

        // Then
        expect(req.authToken).toBe(undefined);
        expect(next).toHaveBeenCalled();
    })
})