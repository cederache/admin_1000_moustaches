import { Request, Response, NextFunction } from 'express'
import { UserController } from '../controllers';
import admin from '../auth/firebase-service';

export const getAuthToken = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    console.warn("No token found", req.headers);
    req.authToken = undefined;
  }
  next();
};

// Verify authToken validity with Firebase
export const checkIfAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      if (!authToken) {
        return res
          .status(401)
          .send({ error: "You are not authorized to make this request" });
      }
      const userInfo = await admin.auth().verifyIdToken(authToken);
      req.authId = userInfo.uid;
      req.authEmail = userInfo.email;

      return next();
    } catch (e) {
      console.error(e);
      return res
        .status(401)
        .send({
          error:
            "An error occured. You are not authorized to make this request",
        });
    }
  });
};

// Check if authenticated user (from Firebase) exist in database
export const getAuthUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.authEmail) {
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }
  const userController = new UserController()
  const user = await userController.getUserByEmail(req.authEmail);
  if (!user) {
    return res
      .status(404)
      .send({ error: "User not found" });
  }
  // Add database user in req
  req.authUser = user;
  next();
};


