// src/__tests__/controllers/recipe.controller.test.ts
import { NextFunction, Request, Response } from "express";
import { recipeService } from "../../services/recipe.service";
import errorHandler from "../../middlewares/errorHandler";
import {
  createRecipe,
  deleteRecipe,
  editRecipe,
  getRecipeById,
  getRecipes,
} from "../../controllers/recipe.controller";
import mongoose from "mongoose";
import { AuthRequest } from "../../types/types";

jest.mock("../../services/recipe.service");

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.end = jest.fn();
  return res;
};

describe("Recipe Controller", () => {
  afterEach(() => jest.clearAllMocks());

  it("should get filtered recipes", async () => {
    const req = { query: {} } as Request;
    const res = mockRes();

    (recipeService.getFilteredRecipes as jest.Mock).mockResolvedValue([
      { title: "Test" },
    ]);

    await getRecipes(req, res);
    expect(recipeService.getFilteredRecipes).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      recipes: [{ title: "Test" }],
    });
  });

  it("should return recipe by ID", async () => {
    const req = { params: { id: "123" } } as unknown as Request;
    const res = mockRes();

    (recipeService.getRecipeById as jest.Mock).mockResolvedValue({
      userId: new mongoose.Types.ObjectId(),
      title: "Test",
      difficulty: "easy",
      ingredients: [],
      steps: [],
    });

    const next = jest.fn();
    await getRecipeById(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should return 404 if recipe not found by ID", async () => {
    const req = { params: { id: "invalid" } } as unknown as Request;
    const res = mockRes();

    (recipeService.getRecipeById as jest.Mock).mockResolvedValue(null);
    const next = jest.fn();
    await getRecipeById(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should create a recipe", async () => {
    const req = {
      body: {
        title: "Cake",
        difficulty: "easy",
        ingredients: ["flour"],
        steps: ["bake"],
      },
      user: { id: new mongoose.Types.ObjectId() },
    } as AuthRequest;

    const res = mockRes();

    (recipeService.createNewRecipe as jest.Mock).mockResolvedValue({
      title: "Cake",
    });
    const next = jest.fn();

    await createRecipe(req, res, next);
    expect(recipeService.createNewRecipe).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should update a recipe", async () => {
    const req = {
      params: { id: "123" },
      body: { title: "Updated" },
    } as unknown as Request;

    const res = mockRes();

    (recipeService.updateRecipe as jest.Mock).mockResolvedValue({
      title: "Updated",
    });

    const next = jest.fn();

    await editRecipe(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should handle update failure", async () => {
    const req = {
      params: { id: "nope" },
      body: { title: "Updated" },
    } as unknown as Request;

    const res = mockRes();

    (recipeService.updateRecipe as jest.Mock).mockResolvedValue(null);
    const next = jest.fn();

    await editRecipe(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should delete a recipe", async () => {
    const userId = new mongoose.Types.ObjectId();

    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      user: { id: userId },
    } as unknown as AuthRequest;

    const res = mockRes();

    (recipeService.getRecipeById as jest.Mock).mockResolvedValue({
      userId, // Use the same ObjectId instance
      title: "Test",
      difficulty: "easy",
      ingredients: [],
      steps: [],
    });

    (recipeService.removeRecipe as jest.Mock).mockResolvedValue(undefined);

    const next = jest.fn();

    await deleteRecipe(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("should handle validation error and respond with 400", async () => {
    const req = {
      body: {
        title: "", // invalid
        ingredients: [],
        steps: [],
      },
      user: { id: new mongoose.Types.ObjectId() },
    } as unknown as AuthRequest;

    const res = mockRes();
    const next: NextFunction = (err) => errorHandler(err, req, res, jest.fn());

    await createRecipe(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Input validation failed",
        errors: expect.any(Array),
      }),
    );
  });

  it("should block non-owner from deleting a recipe", async () => {
    const req = {
      params: { id: "abc" },
      user: { id: "notOwnerId" },
    } as unknown as AuthRequest;
    const res = mockRes();

    (recipeService.getRecipeById as jest.Mock).mockResolvedValue({
      userId: new mongoose.Types.ObjectId(),
      title: "Test",
      difficulty: "easy",
      ingredients: [],
      steps: [],
    });
    const next = jest.fn();
    await deleteRecipe(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Current user cannot delete this recipe",
    });
  });
});
