import { commentRepository } from "../repositories/comment.repository";
import { Comment } from "../zod/schemas";

class CommentService {
  async createNewComment(data: Comment) {
    const commentCreated = commentRepository.create(data);
    return commentCreated;
  }

  async getCommentById(id: string) {
    return await commentRepository.findById(id);
  }

  async updateComment(id: string, data: Partial<Comment>) {
    const updatedComment = await commentRepository.update(id, data);
    return updatedComment;
  }

  async removeComment(id: string) {
    await commentRepository.delete(id);
    return;
  }

  async getRecipeComments(recipeId: string) {
    const comments = await commentRepository.findRecipeComments(recipeId);
    return comments;
  }

  async getChildrenComments(commentId: string) {
    const comments = await commentRepository.findChildComments(commentId);
    return comments;
  }
}

export const commentService = new CommentService();
