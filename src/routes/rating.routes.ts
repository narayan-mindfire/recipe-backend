import express from "express";
import {
  createRating,
  editRating,
  deleteRating,
  getMyRating,
} from "../controllers/rating.controller";
import { protect } from "../middlewares/authMiddleware";
const ratingRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: routes of user ratings for recipes
 */

/**
 * @swagger
 * /ratings/{id}:
 *   get:
 *     summary: Get the current user's rating for a specific recipe
 *     tags: [Ratings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID for which to get the rating
 *     responses:
 *       200:
 *         description: Rating found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rating not found
 */
ratingRoutes.get("/:id", protect, getMyRating);

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Add a new rating to a recipe
 *     tags: [Ratings]
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
 *               - rating
 *             properties:
 *               recipeId:
 *                 type: string
 *                 example: 64fbc8579f3a2e001f0dbb44
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
ratingRoutes.post("/", protect, createRating);

/**
 * @swagger
 * /ratings/{id}:
 *   put:
 *     summary: Update an existing rating for a recipe
 *     tags: [Ratings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Validation or update error
 *       401:
 *         description: Unauthorized
 */
ratingRoutes.put("/:id", protect, editRating);

/**
 * @swagger
 * /ratings/{id}:
 *   delete:
 *     summary: Delete an existing rating
 *     tags: [Ratings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID to delete
 *     responses:
 *       203:
 *         description: Rating deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rating not found
 */
ratingRoutes.delete("/:id", protect, deleteRating);

export default ratingRoutes;
