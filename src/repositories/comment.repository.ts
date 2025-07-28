import { CommentModel } from "../models/comment.model";
import { Comment } from "../zod/schemas";
import { BaseRepository } from "./base.repository";

class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super(CommentModel);
  }
}

export const commentRepository = new CommentRepository();
