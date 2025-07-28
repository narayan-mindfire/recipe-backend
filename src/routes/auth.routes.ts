import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  getMe,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  deleteMe,
  editMe,
} from "../controllers/auth.controller";

const authRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (doctor or patient)
 *     tags: [Auth]
 *     description: |
 *       Creates a user and conditionally creates a doctor or patient profile based on `user_type`.
 *       - For `doctor`, `specialization` is required.
 *       - For `patient`, `gender` and `date_of_birth` are required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - user_type
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               phone_number:
 *                 type: string
 *                 example: "9876543210"
 *               user_type:
 *                 type: string
 *                 enum: [doctor, patient]
 *                 example: doctor
 *               specialization:
 *                 type: string
 *                 example: cardiologist
 *               bio:
 *                 type: string
 *                 example: Expert in heart surgeries
 *               gender:
 *                 type: string
 *                 example: male
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user_id:
 *                   type: string
 *                   example: 60c72b2f9b1e8c001f0e4b8a
 *                 user_type:
 *                   type: string
 *                   example: doctor
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing required fields or email already in use
 */
authRouter.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", loginUser);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh the access token using a valid refresh token cookie
 *     tags: [Auth]
 *     description: |
 *       This endpoint generates a new access token by validating the refresh token stored in the user's cookie.
 *       The refresh token must be present in the HTTP-only cookie named `refreshToken`.
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: No refresh token provided
 *       403:
 *         description: Invalid or expired refresh token
 */
authRouter.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs out a user by clearing the authentication cookies
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: User not authenticated
 *     description: |
 *       This endpoint clears the authentication cookies (`accessToken` and `refreshToken`) to log out the user.
 *       It should be called when the user wants to log out of the application.
 *       The cookies are set to expire immediately, effectively logging the user out.
 */
authRouter.post("/logout", logoutUser);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Auth]
 *     description: |
 *       This endpoint retrieves the profile of the currently authenticated user.
 *       It requires the user to be authenticated via the `protect` middleware.
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 */
authRouter.get("/me", protect, getMe);

authRouter.delete("/me", protect, deleteMe);

authRouter.put("/me", protect, editMe);
export default authRouter;
