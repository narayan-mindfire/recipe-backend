import bcrypt from "bcrypt";
import { authRepository } from "../repositories/auth.repository";
import { User } from "../zod/schemas";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import path from "path";
import fs from "fs";

class AuthService {
  private async checkUserPresence(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }
  async register(data: Omit<User, "createdAt" | "updatedAt">) {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await authRepository.create({
      ...data,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    return { user, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    return { user, accessToken, refreshToken };
  }

  async refresh(token: string) {
    const userId = verifyRefreshToken(token);
    if (!userId) throw new Error("Invalid or expired refresh token");

    const accessToken = generateAccessToken(userId);
    return { accessToken };
  }

  async me(userId: string) {
    const user = await this.checkUserPresence(userId);
    const { password: _password, ...rest } = user.toObject();
    return rest;
  }
  async deleteMe(userId: string) {
    const user = await this.checkUserPresence(userId);
    if (user.profileImage && typeof user.profileImage === "string") {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        user.profileImage,
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await authRepository.deleteMe(userId);
  }

  async editMe(userId: string, newUser: Partial<User>) {
    await this.checkUserPresence(userId);
    const updatedUser = await authRepository.editMe(userId, newUser);

    if (!updatedUser) throw new Error("Failed to update user");

    const { password: _password, ...rest } = updatedUser.toObject();
    return rest;
  }
}

export const authService = new AuthService();
