import { commentRepository } from "../repositories/comment.repository";
import { Comment } from "../zod/schemas";

class CommentService {
  async createNewComment(data: Comment) {
    const commentCreated = commentRepository.create(data);
    return commentCreated;
  }
}

export const commentService = new CommentService();
