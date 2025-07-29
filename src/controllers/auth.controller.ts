import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { userSchemaZ } from "../zod/schemas";
import { AuthRequest } from "../types/types";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
    );
    res
      .status(201)
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .json({ user, accessToken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body.email,
      req.body.password,
    );
    res
      .status(200)
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .json({ user, accessToken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ message: "No refresh token provided" });

    const { accessToken } = await authService.refresh(token);
    res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
};

export const logoutUser = async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await authService.me((req as AuthRequest).user.id);
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
};

export const deleteMe = async (req: Request, res: Response) => {
  try {
    await authService.deleteMe((req as AuthRequest).user.id);
    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
};

export const editMe = async (req: Request, res: Response) => {
  try {
    const updateUserSchema = userSchemaZ.partial().omit({ password: true });

    const validatedData = updateUserSchema.parse(req.body);

    const updatedUser = await authService.editMe(
      (req as AuthRequest).user.id,
      validatedData,
    );

    res.status(200).json({ user: updatedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
};
