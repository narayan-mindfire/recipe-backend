import express, { Request, Response } from "express";
import {
  createComment,
  editComment,
  deleteComment,
} from "../controllers/comment.controller";
import { protect } from "../middlewares/authMiddleware";

const commentRoutes = express.Router();

// GET /comments/:id/replies - getChildComments
commentRoutes.get("/:id/replies", (req: Request, res: Response) => {
  const commentId = req.params.id;
  res.send(`getChildComments is working for comment ID ${commentId}`);
});

// POST /comments - createComment
commentRoutes.post("/", protect, createComment);

// put /comments/:id - editComment (only by owner)
commentRoutes.put("/:id", protect, editComment);
// DELETE /comments/:id - deleteComment (owner or admin)
commentRoutes.delete("/:id", protect, deleteComment);

export default commentRoutes;
