import mongoose from "mongoose";
import { recipeRepository } from "../repositories/recipe.repository";
import { RecipeFilters } from "../types/types";
import { Recipe } from "../zod/schemas";

class RecipeService {
  async createNewRecipe(data: Recipe) {
    const recipeCreated = await recipeRepository.create(data);
    if (!recipeCreated) throw new Error("Could not create recipe");
    return recipeCreated;
  }

  async getRecipeById(id: string) {
    const recipe = await recipeRepository.findById(id);
    return recipe;
  }

  async getFilteredRecipes(
    filters: RecipeFilters,
    limit: number,
    skip: number,
    sortBy: string,
    order: 1 | -1,
  ) {
    return await recipeRepository.findWithFilters(
      filters,
      limit,
      skip,
      sortBy,
      order,
    );
  }

  async updateRecipe(id: string, newRecipe: Partial<Recipe>) {
    return await recipeRepository.editRecipe(id, newRecipe);
  }

  async removeRecipe(id: string) {
    await recipeRepository.delete(id);
  }

  async getMyRecipes(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    const recipes = await recipeRepository.findAll({ userId: objectId });
    return recipes;
  }
}

export const recipeService = new RecipeService();
