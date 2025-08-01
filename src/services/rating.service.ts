import { Types } from "mongoose";
import { ratingRepository } from "../repositories/rating.repository";
import { recipeRepository } from "../repositories/recipe.repository";
import { Rating } from "../zod/schemas";

class RatingService {
  async getRating(recipeId: string, userId: string) {
    const rating = await ratingRepository.findAll({
      recipeId: new Types.ObjectId(recipeId),
      userId: new Types.ObjectId(userId),
    });
    if (!rating) throw new Error("could not find rating");
    return rating[0];
  }

  async createNewRating(payload: Rating) {
    const rating = await ratingRepository.create(payload);
    if (!rating) throw new Error("Could not create rating");

    const recipe = await recipeRepository.findById(rating.recipeId.toString());
    if (!recipe) throw new Error("Recipe not found");

    const newNumRatings = (recipe.numberOfRatings || 0) + 1;
    const newAvgRating =
      ((recipe.averageRating || 0) * (recipe.numberOfRatings || 0) +
        rating.rating) /
      newNumRatings;

    await recipeRepository.editRecipe(recipe._id.toString(), {
      numberOfRatings: newNumRatings,
      averageRating: newAvgRating,
    });

    return rating;
  }

  async updateRating(id: string, payload: Partial<Rating>) {
    const oldRating = await ratingRepository.findById(id);
    if (!oldRating) throw new Error("Old rating not found");

    const updatedRating = await ratingRepository.update(id, payload);
    if (!updatedRating) throw new Error("Could not update rating");

    // Adjust averageRating if rating value changed
    if (payload.rating !== undefined && payload.rating !== oldRating.rating) {
      const recipe = await recipeRepository.findById(
        oldRating.recipeId.toString(),
      );
      if (!recipe) throw new Error("Recipe not found");

      const total = (recipe.averageRating || 0) * (recipe.numberOfRatings || 0);
      const newAvgRating =
        (total - oldRating.rating + payload.rating) / recipe.numberOfRatings!;

      await recipeRepository.editRecipe(recipe._id.toString(), {
        averageRating: newAvgRating,
      });
    }

    return updatedRating;
  }

  async deleteRating(id: string) {
    const rating = await ratingRepository.findById(id);
    if (!rating) throw new Error("Rating not found");

    const recipe = await recipeRepository.findById(rating.recipeId.toString());
    if (!recipe) throw new Error("Recipe not found");

    const newNumRatings = recipe.numberOfRatings! - 1;

    let newAvgRating = 0;
    if (newNumRatings > 0) {
      const total = recipe.averageRating! * recipe.numberOfRatings!;
      newAvgRating = (total - rating.rating) / newNumRatings;
    }

    await recipeRepository.editRecipe(recipe._id.toString(), {
      numberOfRatings: newNumRatings,
      averageRating: newAvgRating,
    });

    await ratingRepository.delete(id);
  }

  async findRating(id: string) {
    const rating = await ratingRepository.findById(id);
    return rating;
  }
}

export const ratingService = new RatingService();
