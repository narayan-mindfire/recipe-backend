import express, { Request, Response } from "express";
import { createComment } from "../controllers/comment.controller";
import { protect } from "../middlewares/authMiddleware";

const commentRoutes = express.Router();

// GET /comments/:id/replies - getChildComments
commentRoutes.get("/:id/replies", (req: Request, res: Response) => {
  const commentId = req.params.id;
  res.send(`getChildComments is working for comment ID ${commentId}`);
});

// POST /comments - createComment
commentRoutes.post("/", protect, createComment);

// PATCH /comments/:id - editComment (only by owner)
commentRoutes.patch("/:id", (req: Request, res: Response) => {
  const commentId = req.params.id;
  res.send(
    `editComment is working for comment ID ${commentId} (only by owner)`,
  );
});
// DELETE /comments/:id - deleteComment (owner or admin)
commentRoutes.delete("/:id", (req: Request, res: Response) => {
  const commentId = req.params.id;
  res.send(
    `deleteComment is working for comment ID ${commentId} (owner or admin)`,
  );
});

export default commentRoutes;
