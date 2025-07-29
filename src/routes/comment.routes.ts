import express from "express";
import {
  createComment,
  editComment,
  deleteComment,
  getRecipeComments,
  getCommentReplies,
} from "../controllers/comment.controller";
import { protect } from "../middlewares/authMiddleware";

const commentRoutes = express.Router();

commentRoutes.get("/:id/replies", getCommentReplies);

commentRoutes.get("/:recipeId", getRecipeComments);

commentRoutes.post("/", protect, createComment);

commentRoutes.put("/:id", protect, editComment);

commentRoutes.delete("/:id", protect, deleteComment);

export default commentRoutes;
