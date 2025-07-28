import { CommentModel } from "../models/comment.model";
import { Comment } from "../zod/schemas";
import { BaseRepository } from "./base.repository";

class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super(CommentModel);
  }
  findRecipeComments = async (recipeId: string) => {
    const comments = await this.model.find({
      recipeId,
      parentCommentId: null,
    });
    return comments;
  };

  findChildComments = async (commentId: string) => {
    const comments = await this.model.find({
      parentCommentId: commentId,
    });
    return comments;
  };
}
export const commentRepository = new CommentRepository();
