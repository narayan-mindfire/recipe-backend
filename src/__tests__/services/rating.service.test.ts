// src/__tests__/services/rating.service.test.ts
import { ratingService } from "../../services/rating.service";
import { ratingRepository } from "../../repositories/rating.repository";
import { recipeRepository } from "../../repositories/recipe.repository";
import { Rating } from "../../zod/schemas";

jest.mock("../../repositories/rating.repository");
jest.mock("../../repositories/recipe.repository");

describe("Rating Service", () => {
  afterEach(() => jest.clearAllMocks());

  it("should get a rating by user and recipe", async () => {
    const mockRating = { rating: 4 };
    (ratingRepository.findAll as jest.Mock).mockResolvedValue([mockRating]);

    const result = await ratingService.getRating(
      "62a23958e5a9e9b88f853a67",
      "62a23958e5a9e9b88f853a66",
    );
    expect(result).toEqual(mockRating);
  });

  it("should create a new rating and update recipe", async () => {
    const mockRating = {
      recipeId: "recipe123",
      rating: 5,
    } as unknown as Rating;
    const mockRecipe = {
      _id: "recipe123",
      numberOfRatings: 1,
      averageRating: 5,
    };

    (ratingRepository.create as jest.Mock).mockResolvedValue(mockRating);
    (recipeRepository.findById as jest.Mock).mockResolvedValue(mockRecipe);
    (recipeRepository.editRecipe as jest.Mock).mockResolvedValue(undefined);

    const result = await ratingService.createNewRating(mockRating);
    expect(result).toEqual(mockRating);
  });

  it("should update a rating and adjust average", async () => {
    const oldRating = {
      rating: 3,
      recipeId: "recipe123",
    };
    const updatedRating = {
      rating: 5,
    };
    const mockRecipe = {
      _id: "recipe123",
      numberOfRatings: 2,
      averageRating: 4,
    };

    (ratingRepository.findById as jest.Mock).mockResolvedValue(oldRating);
    (ratingRepository.update as jest.Mock).mockResolvedValue(updatedRating);
    (recipeRepository.findById as jest.Mock).mockResolvedValue(mockRecipe);
    (recipeRepository.editRecipe as jest.Mock).mockResolvedValue(undefined);

    const result = await ratingService.updateRating("ratingId", updatedRating);
    expect(result).toEqual(updatedRating);
  });

  it("should delete a rating and update recipe stats", async () => {
    const mockRating = {
      rating: 5,
      recipeId: "recipe123",
    };
    const mockRecipe = {
      _id: "recipe123",
      numberOfRatings: 2,
      averageRating: 4,
    };

    (ratingRepository.findById as jest.Mock).mockResolvedValue(mockRating);
    (recipeRepository.findById as jest.Mock).mockResolvedValue(mockRecipe);
    (recipeRepository.editRecipe as jest.Mock).mockResolvedValue(undefined);
    (ratingRepository.delete as jest.Mock).mockResolvedValue(undefined);

    await expect(
      ratingService.deleteRating("ratingId"),
    ).resolves.toBeUndefined();
  });

  it("should find rating by id", async () => {
    (ratingRepository.findById as jest.Mock).mockResolvedValue({});
    const result = await ratingService.findRating("ratingId");
    expect(result).toEqual({});
  });
});
