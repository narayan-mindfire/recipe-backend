import { BaseRepository } from "./base.repository";
import { RecipeModel } from "../models/recipe.model";
import { Recipe } from "../zod/schemas";
import { RecipeFilters } from "../types/types";

class RecipeRepository extends BaseRepository<Recipe> {
  constructor() {
    super(RecipeModel);
  }
  async findWithFilters(
    filters: RecipeFilters,
    limit: number = 10,
    skip: number = 0,
    sortBy: string = "updatedAt",
    order: 1 | -1 = 1,
  ) {
    return this.model
      .find(filters)
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: order });
  }

  async editRecipe(id: string, newRecipe: Partial<Recipe>) {
    return this.model.findByIdAndUpdate(id, newRecipe, {
      new: true,
      runValidators: true,
    });
  }
}

export const recipeRepository = new RecipeRepository();
