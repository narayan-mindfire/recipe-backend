import { Schema, model } from "mongoose";
import type { Comment } from "../zod/schemas";

const commentSchema = new Schema<Comment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

commentSchema.index(
  { userId: 1, recipeId: 1 },
  { unique: true, partialFilterExpression: { parentCommentId: null } },
);

export const CommentModel = model<Comment>("Comment", commentSchema);
