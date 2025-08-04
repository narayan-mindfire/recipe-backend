import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { recipeService } from "../services/recipe.service";
import { recipeSchemaZ } from "../zod/schemas";
import mongoose from "mongoose";
import { AuthRequest, RecipeFilters } from "../types/types";

export interface RecipeQuery {
  ingredients?: string;
  minRating?: string;
  maxTime?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: "1" | "-1";
}

/**
 * @desc    Get all recipes with optional filters and pagination
 * @route   GET /api/recipes
 * @access  Public
 */
export const getRecipes = async (
  req: Request<unknown, unknown, unknown, RecipeQuery>,
  res: Response,
) => {
  const {
    ingredients,
    minRating,
    maxTime,
    page = "1",
    limit = "10",
    sortBy = "updatedAt",
    order = "-1",
  } = req.query;

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const parsedOrder = parseInt(order, 10) as 1 | -1;
  const parsedMinRating = minRating ? parseFloat(minRating) : undefined;
  const parsedMaxTime = maxTime ? parseInt(maxTime, 10) : undefined;

  const filters: RecipeFilters = {};

  if (ingredients) {
    const ingredientsArray = ingredients.split(",").map((item) => item.trim());
    filters.ingredients = { $all: ingredientsArray };
  }

  if (parsedMinRating !== undefined) {
    filters.averageRating = { $gte: parsedMinRating };
  }

  if (parsedMaxTime !== undefined) {
    filters.preparationTime = { $lte: parsedMaxTime };
  }

  const skip = (parsedPage - 1) * parsedLimit;

  const recipes = await recipeService.getFilteredRecipes(
    filters,
    parsedLimit,
    skip,
    sortBy,
    parsedOrder,
  );

  res.json({ success: true, recipes });
};

/**
 * @desc    Get single recipe by ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
export const getRecipeById = asyncHandler(
  async (req: Request, res: Response) => {
    const recipe = await recipeService.getRecipeById(req.params.id);
    if (!recipe) {
      res.status(404).json({ message: "recipe not found" });
      return;
    }
    const validateData = recipeSchemaZ.parse(recipe);
    if (validateData) {
      res.status(200).json({ recipe });
      return;
    } else {
      res.status(404).json({ message: "didn't find the recipe" });
      return;
    }
  },
);

/**
 * @desc    Create a new recipe
 * @route   POST /api/recipes
 * @access  Private (authenticated)
 */
export const createRecipe = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = new mongoose.Types.ObjectId((req as AuthRequest).user.id);

    let ingredients = req.body.ingredients;
    let steps = req.body.steps;

    if (typeof ingredients === "string") {
      ingredients = ingredients.split(",").map((item) => item.trim());
    } else if (!Array.isArray(ingredients)) {
      ingredients = [ingredients];
    }
    if (!Array.isArray(steps)) steps = [steps];

    const preparationTime = req.body.preparationTime
      ? Number(req.body.preparationTime)
      : undefined;

    const payload = {
      title: req.body.title,
      description: req.body.description,
      preparationTime,
      difficulty: req.body.difficulty,
      ingredients,
      steps,
      recipeImage: req.file?.filename || "",
      userId,
    };

    const validatedData = recipeSchemaZ.parse(payload);
    const recipe = await recipeService.createNewRecipe(validatedData);

    res.status(201).json({ recipe });
  },
);

/**
 * @desc    Edit a recipe by ID
 * @route   PUT /api/recipes/:id
 * @access  Private (authenticated)
 */
export const editRecipe = asyncHandler(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    preparationTime: req.body.preparationTime
      ? parseInt(req.body.preparationTime)
      : undefined,
    ingredients: req.body.ingredients
      ? req.body.ingredients.split(",").map((i: string) => i.trim())
      : undefined,
    steps: Array.isArray(req.body.steps)
      ? req.body.steps
      : req.body.steps
        ? [req.body.steps]
        : undefined,
    recipeImage: req.file?.filename || undefined,
  };

  const editRecipeSchema = recipeSchemaZ.partial();
  const result = editRecipeSchema.parse(payload);

  const updatedRecipe = await recipeService.updateRecipe(req.params.id, result);

  if (!updatedRecipe) {
    res.status(404).json({ message: "Recipe not found" });
    return;
  }
  res.status(200).json({ message: "Recipe updated", recipe: updatedRecipe });
});

/**
 * @desc    Delete a recipe by ID (only by the creator)
 * @route   DELETE /api/recipes/:id
 * @access  Private (authenticated)
 */
export const deleteRecipe = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user.id;

    const recipe = await recipeService.getRecipeById(req.params.id);

    if (!recipe) {
      res.status(404).json({ message: "Recipe not found" });
      return;
    }

    const validateData = recipeSchemaZ.parse(recipe);

    if (userId.toString() !== validateData.userId.toString()) {
      res
        .status(403)
        .json({ message: "Current user cannot delete this recipe" });
      return;
    }
    await recipeService.removeRecipe(req.params.id);
    res.status(204).end();
  },
);

/**
 * @desc    Get all recipes created by the logged-in user
 * @route   GET /api/recipes/my
 * @access  Private (authenticated)
 */
export const getMyRecipes = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user.id;
    const myRecipies = await recipeService.getMyRecipes(userId);
    res.status(200).json({ myRecipies });
  },
);
