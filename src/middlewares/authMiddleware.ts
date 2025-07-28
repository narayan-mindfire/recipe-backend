import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Response, NextFunction, Request } from "express";
import { UserModel } from "../models/user.model";
import { AuthRequest } from "../types/types";

interface JwtPayload {
  userId: string;
}

/**
 * Middleware to protect routes using JWT from cookies.
 *
 * This reads the access token from `req.cookies.accessToken`,
 * verifies it, and attaches the user to `req.user`.
 */
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token found");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const user = await UserModel.findById(decoded.userId).select("-password");
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      (req as AuthRequest).user = user;
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Something went wrong" });
      }
    }
  },
);
