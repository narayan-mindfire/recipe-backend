import { Schema, model } from "mongoose";
import { Recipe } from "../zod/schemas";

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
    averageRating: Number,
    numberOfRatings: Number,
  },
  { timestamps: true },
);

export const RecipeModel = model<Recipe>("Recipe", recipeSchema);
