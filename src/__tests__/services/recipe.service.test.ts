import { recipeService } from "../../services/recipe.service";
import { recipeRepository } from "../../repositories/recipe.repository";
import { Recipe } from "../../zod/schemas";
import mongoose from "mongoose";

// Mock the entire recipeRepository
jest.mock("../../repositories/recipe.repository");

describe("RecipeService", () => {
  const mockRecipe = {
    title: "Pizza",
    difficulty: "easy",
    ingredients: ["cheese", "dough"],
    steps: ["bake it"],
    userId: new mongoose.Types.ObjectId(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewRecipe", () => {
    it("should create a recipe successfully", async () => {
      (recipeRepository.create as jest.Mock).mockResolvedValue(mockRecipe);
      const result = await recipeService.createNewRecipe(mockRecipe as Recipe);
      expect(recipeRepository.create).toHaveBeenCalledWith(mockRecipe);
      expect(result).toEqual(mockRecipe);
    });

    it("should throw error when creation fails", async () => {
      (recipeRepository.create as jest.Mock).mockResolvedValue(null);
      await expect(
        recipeService.createNewRecipe(mockRecipe as Recipe),
      ).rejects.toThrow("Could not create recipe");
    });
  });

  describe("getRecipeById", () => {
    it("should return recipe by ID", async () => {
      (recipeRepository.findById as jest.Mock).mockResolvedValue(mockRecipe);
      const result = await recipeService.getRecipeById("recipe123");
      expect(recipeRepository.findById).toHaveBeenCalledWith("recipe123");
      expect(result).toEqual(mockRecipe);
    });
  });

  describe("getFilteredRecipes", () => {
    it("should return filtered recipes", async () => {
      (recipeRepository.findWithFilters as jest.Mock).mockResolvedValue([
        mockRecipe,
      ]);
      const result = await recipeService.getFilteredRecipes(
        {},
        10,
        0,
        "title",
        1,
      );
      expect(recipeRepository.findWithFilters).toHaveBeenCalledWith(
        {},
        10,
        0,
        "title",
        1,
      );
      expect(result).toEqual([mockRecipe]);
    });
  });

  describe("updateRecipe", () => {
    it("should update recipe", async () => {
      const updated = { ...mockRecipe, title: "Updated Pizza" };
      (recipeRepository.editRecipe as jest.Mock).mockResolvedValue(updated);
      const result = await recipeService.updateRecipe("id123", {
        title: "Updated Pizza",
      });
      expect(recipeRepository.editRecipe).toHaveBeenCalledWith("id123", {
        title: "Updated Pizza",
      });
      expect(result).toEqual(updated);
    });
  });

  describe("removeRecipe", () => {
    it("should delete recipe", async () => {
      (recipeRepository.delete as jest.Mock).mockResolvedValue(undefined);
      await recipeService.removeRecipe("id123");
      expect(recipeRepository.delete).toHaveBeenCalledWith("id123");
    });
  });
});
