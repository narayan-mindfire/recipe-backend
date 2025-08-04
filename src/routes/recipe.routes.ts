import express from "express";
import {
  createRecipe,
  deleteRecipe,
  editRecipe,
  getRecipeById,
  getRecipes,
  getMyRecipes,
} from "../controllers/recipe.controller";
import { protect } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const recipeRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe routes. Read is for all users, write requires authentication.
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get a list of all recipes with optional filters, pagination, and sorting
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: ingredients
 *         schema:
 *           type: string
 *         description: Comma-separated list of ingredients (e.g., tomato,onion)
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum average rating
 *       - in: query
 *         name: maxTime
 *         schema:
 *           type: integer
 *         description: Maximum preparation time in minutes
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page (default 10)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., createdAt, averageRating)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: ["1", "-1"]
 *         description: Sort order -> 1 for ascending, -1 for descending
 *     responses:
 *       200:
 *         description: List of filtered recipes
 */
recipeRoutes.get("/", getRecipes);

/**
 * @swagger
 * /recipes/me:
 *   get:
 *     summary: Get all recipes created by the currently logged-in user
 *     tags: [Recipes]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user-authored recipes
 *       401:
 *         description: Unauthorized
 */
recipeRoutes.get("/me", protect, getMyRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get a specific recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe found
 *       404:
 *         description: Recipe not found
 */
recipeRoutes.get("/:id", getRecipeById);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - difficulty
 *               - ingredients
 *               - steps
 *             properties:
 *               title:
 *                 type: string
 *                 example: Spaghetti Bolognese
 *               description:
 *                 type: string
 *                 example: A rich and meaty Italian pasta dish.
 *               preparationTime:
 *                 type: integer
 *                 example: 45
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: medium
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [pasta, tomato, meat]
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Boil pasta, Cook sauce, Mix together]
 *               recipeImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Validation or input error
 *       401:
 *         description: Unauthorized
 */
recipeRoutes.post("/", protect, upload.single("recipeImage"), createRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Edit a recipe by ID
 *     tags: [Recipes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID to edit
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               preparationTime:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *               recipeImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       400:
 *         description: Invalid update data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 */
recipeRoutes.put("/:id", upload.single("recipeImage"), protect, editRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete a recipe by ID
 *     tags: [Recipes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID to delete
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User not allowed to delete this recipe
 *       404:
 *         description: Recipe not found
 */
recipeRoutes.delete("/:id", protect, deleteRecipe);

export default recipeRoutes;
