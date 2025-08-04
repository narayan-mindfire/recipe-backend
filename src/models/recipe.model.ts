import { Schema, model } from "mongoose";
import { Recipe } from "../zod/schemas";

/**
 * Mongoose schema for storing recipes.
 * Supports nested comments using `parentCommentId`.
 */
const recipeSchema = new Schema<Recipe>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    preparationTime: Number,
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    ingredients: [String],
    steps: [String],
    recipeImage: String,
    averageRating: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 0 },
  },
  { timestamps: true },
);

recipeSchema.index({ userId: 1, title: 1, steps: 1 }, { unique: true });

export const RecipeModel = model<Recipe>("Recipe", recipeSchema);
