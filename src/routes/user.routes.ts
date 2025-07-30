import express from "express";
import { getUserById } from "../controllers/user.controller";
const userRouter = express.Router();

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6889a4d8313279520c4c8b55
 *                     fname:
 *                       type: string
 *                       example: Narayan
 *                     lname:
 *                       type: string
 *                       example: Pradhan
 *                     email:
 *                       type: string
 *                       example: narayan@pradhan.com
 *                     bio:
 *                       type: string
 *                       example: Backend Developer | Learning everyday.
 *                     profileImage:
 *                       type: string
 *                       example: https://example.com/images/narayan.jpg
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-30T04:51:36.931Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-30T05:01:25.114Z
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       404:
 *         description: User not found
 */
userRouter.get("/:id", getUserById);

export default userRouter;
