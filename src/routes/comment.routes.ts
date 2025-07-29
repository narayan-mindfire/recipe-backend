import express from "express";
import {
  createComment,
  editComment,
  deleteComment,
  getRecipeComments,
  getCommentReplies,
} from "../controllers/comment.controller";
import { protect } from "../middlewares/authMiddleware";

const commentRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment routes - read - all, write - authenticated users
 */
/**
 * @swagger
 * /comments/{id}/replies:
 *   get:
 *     summary: Get replies to a specific comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the parent comment
 *     responses:
 *       200:
 *         description: Replies retrieved successfully
 *       404:
 *         description: Comment not found or no replies exist
 */
commentRoutes.get("/:id/replies", getCommentReplies);

/**
 * @swagger
 * /comments/{recipeId}:
 *   get:
 *     summary: Get top-level comments for a recipe
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the recipe
 *     responses:
 *       200:
 *         description: List of top-level comments
 *       404:
 *         description: Recipe not found
 */
commentRoutes.get("/:recipeId", getRecipeComments);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment or reply
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeId
 *               - comment
 *             properties:
 *               recipeId:
 *                 type: string
 *                 example: 64fbc8579f3a2e001f0dbb44
 *               parentCommentId:
 *                 type: string
 *                 nullable: true
 *                 example: 64fbc85c9f3a2e001f0dbb45
 *                 description: Optional. Provide this only when replying to an existing comment.
 *               comment:
 *                 type: string
 *                 example: "This recipe is amazing!"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation or input error
 *       401:
 *         description: Unauthorized
 */
commentRoutes.post("/", protect, createComment);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Edit an existing comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: User not authorized to edit this comment
 *       404:
 *         description: Comment not found
 */
commentRoutes.put("/:id", protect, editComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       403:
 *         description: User not authorized to delete this comment
 *       404:
 *         description: Comment not found
 */
commentRoutes.delete("/:id", protect, deleteComment);

export default commentRoutes;
