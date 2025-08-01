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
    order = "1",
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
    filters.rating = { $gte: parsedMinRating };
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

//68871f7fd8b1dce3bdf4b202
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

export const createRecipe = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      userId: new mongoose.Types.ObjectId((req as AuthRequest).user.id),
    };
    const validatedData = recipeSchemaZ.parse(payload);
    const recipe = await recipeService.createNewRecipe(validatedData);
    res.status(201).json({ recipe });
  },
);

export const editRecipe = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const editRecipeSchema = recipeSchemaZ.partial();
  const result = editRecipeSchema.parse(payload);

  const updatedRecipe = await recipeService.updateRecipe(req.params.id, result);

  if (!updatedRecipe) {
    res.status(404).json({ message: "Recipe not found" });
    return;
  }
  res.status(200).json({ message: "Recipe updated", recipe: updatedRecipe });
});

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

export const getMyRecipes = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user.id;
    const myRecipies = await recipeService.getMyRecipes(userId);
    res.status(200).json({ myRecipies });
  },
);
