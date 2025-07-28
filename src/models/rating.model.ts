import { Schema, model } from "mongoose";
import { Rating } from "../zod/schemas";

const ratingSchema = new Schema<Rating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true },
);

ratingSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export const RatingModel = model<Rating>("Rating", ratingSchema);
