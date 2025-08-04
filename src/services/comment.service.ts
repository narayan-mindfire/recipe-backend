import { commentRepository } from "../repositories/comment.repository";
import { Comment } from "../zod/schemas";

class CommentService {
  /**
   * Create a new comment.
   * @param data - Comment data.
   * @returns Created comment.
   */
  async createNewComment(data: Comment) {
    const commentCreated = commentRepository.create(data);
    return commentCreated;
  }

  /**
   * Get a comment by its ID.
   * @param id - Comment ID.
   * @returns Found comment or null.
   */
  async getCommentById(id: string) {
    return await commentRepository.findById(id);
  }

  /**
   * Update a comment by ID.
   * @param id - Comment ID.
   * @param data - Partial comment data.
   * @returns Updated comment.
   */
  async updateComment(id: string, data: Partial<Comment>) {
    const updatedComment = await commentRepository.update(id, data);
    return updatedComment;
  }

  /**
   * Delete a comment by ID.
   * @param id - Comment ID.
   */
  async removeComment(id: string) {
    await commentRepository.delete(id);
    return;
  }

  /**
   * Get top-level comments for a recipe.
   * @param recipeId - Recipe ID.
   * @returns Array of comments.
   */
  async getRecipeComments(recipeId: string) {
    const comments = await commentRepository.findRecipeComments(recipeId);
    return comments;
  }

  /**
   * Get replies to a specific comment.
   * @param commentId - Parent comment ID.
   * @returns Array of child comments.
   */
  async getChildrenComments(commentId: string) {
    const comments = await commentRepository.findChildComments(commentId);
    return comments;
  }
}

export const commentService = new CommentService();
