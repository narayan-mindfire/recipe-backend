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

export const editComment = asyncHandler(async (req: Request, res: Response) => {
  const editComment = commentSchemaZ.partial().parse(req.body);
  const id = req.params.id;
  const userId = (req as AuthRequest).user.id;
  const comment = await commentService.getCommentById(id);
  const validateData = commentSchemaZ.parse(comment);
  if (validateData.userId.toString() !== userId.toString()) {
    res.status(403).json({ message: "user not authorised" });
    return;
  }
  if (!comment) {
    res.status(404).json({ message: "comment could not be found" });
    return;
  }
  const updatedComment = await commentService.updateComment(id, editComment);

  if (!updatedComment) {
    res.status(500).json({ message: "could not update comment" });
    return;
  }
  res
    .status(200)
    .json({ message: "comment updated successful", comment: updatedComment });
});

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = (req as AuthRequest).user.id;
    const comment = await commentService.getCommentById(id);
    const validateData = commentSchemaZ.parse(comment);
    if (validateData.userId.toString() !== userId.toString()) {
      res.status(403).json({ message: "user not authorised" });
      return;
    }
    await commentService.removeComment(id);
    res.status(204).end();
  },
);
