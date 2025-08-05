import mongoose from "mongoose";
import { recipeRepository } from "../repositories/recipe.repository";
import { RecipeFilters } from "../types/types";
import { Recipe } from "../zod/schemas";

class RecipeService {
  /**
   * Create a new recipe.
   * @param data - Recipe data.
   * @returns The created recipe.
   * @throws If creation fails.
   */
  async createNewRecipe(data: Recipe) {
    const recipeCreated = await recipeRepository.create(data);
    if (!recipeCreated) throw new Error("Could not create recipe");
    return recipeCreated;
  }

  /**
   * Get a recipe by its ID.
   * @param id - Recipe ID.
   * @returns The recipe or null.
   */
  async getRecipeById(id: string) {
    const recipe = await recipeRepository.findById(id);
    return recipe;
  }

  /**
   * Fetch recipes using filters, pagination, and sorting.
   * @param filters - Filtering criteria.
   * @param limit - Max number of recipes to return.
   * @param skip - Number of recipes to skip.
   * @param sortBy - Field to sort by.
   * @param order - Sort order (1 or -1).
   * @returns Filtered list of recipes.
   */
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

  /**
   * Update a recipe by ID.
   * @param id - Recipe ID.
   * @param newRecipe - Fields to update.
   * @returns The updated recipe or null.
   */
  async updateRecipe(id: string, newRecipe: Partial<Recipe>) {
    return await recipeRepository.editRecipe(id, newRecipe);
  }

  /**
   * Delete a recipe by ID.
   * @param id - Recipe ID.
   */
  async removeRecipe(id: string) {
    await recipeRepository.delete(id);
  }

  /**
   * Get all recipes created by a specific user.
   * @param userId - User's ID.
   * @returns List of the user's recipes.
   */
  async getMyRecipes(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    const recipes = await recipeRepository.findAll({ userId: objectId });
    return recipes;
  }
}

export const recipeService = new RecipeService();
