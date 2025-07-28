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
    hasChildren: { type: Boolean, default: false },
  },
  { timestamps: true },
);

commentSchema.index(
  { userId: 1, recipeId: 1 },
  { unique: true, partialFilterExpression: { parentCommentId: null } },
);

commentSchema.index(
  { parentCommentId: 1, userId: 1, comment: 1 },
  { unique: true },
);

export const CommentModel = model<Comment>("Comment", commentSchema);
