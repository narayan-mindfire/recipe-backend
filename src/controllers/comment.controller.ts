import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { commentService } from "../services/comment.service";
import { AuthRequest } from "../types/types";
import { commentSchemaZ } from "../zod/schemas";
import { Types } from "mongoose";

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = new Types.ObjectId((req as AuthRequest).user.id);
    const recipeId = new Types.ObjectId(req.body.recipeId);
    const parentCommentId = req.body.parentCommentId
      ? new Types.ObjectId(req.body.parentCommentId)
      : null;
    const payload = {
      ...req.body,
      userId,
      recipeId,
      comment: req.body.comment,
      parentCommentId,
    };
    const validateData = commentSchemaZ.parse(payload);
    const newComment = await commentService.createNewComment(validateData);
    if (!newComment) {
      res.status(500).json({ message: "could not create comment" });
      return;
    }
    res
      .status(201)
      .json({ message: "comment creation successful", comment: newComment });
  },
);
