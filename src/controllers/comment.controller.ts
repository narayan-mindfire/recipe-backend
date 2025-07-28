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
      parentCommentId,
    };

    const validateData = commentSchemaZ.parse(payload);
    const newComment = await commentService.createNewComment(validateData);

    if (!newComment) {
      res.status(500).json({ message: "Could not create comment" });
      return;
    }

    if (parentCommentId) {
      await commentService.updateComment(parentCommentId.toString(), {
        hasChildren: true,
      });
    }

    res.status(201).json({
      message: "Comment creation successful",
      comment: newComment,
    });
  },
);

export const editComment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as AuthRequest).user.id;
  const comment = await commentService.getCommentById(id);

  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }

  const validateData = commentSchemaZ.parse(comment);

  if (validateData.userId.toString() !== userId.toString()) {
    res.status(403).json({ message: "User not authorized" });
    return;
  }

  const editPayload = commentSchemaZ.partial().parse(req.body);
  const updatedComment = await commentService.updateComment(id, editPayload);

  if (!updatedComment) {
    res.status(500).json({ message: "Could not update comment" });
    return;
  }

  res.status(200).json({
    message: "Comment update successful",
    comment: updatedComment,
  });
});

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = (req as AuthRequest).user.id;
    const comment = await commentService.getCommentById(id);

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const validateData = commentSchemaZ.parse(comment);

    if (validateData.userId.toString() !== userId.toString()) {
      res.status(403).json({ message: "User not authorized" });
      return;
    }

    await commentService.removeComment(id);
    res.status(204).end();
    return;
  },
);

export const getRecipeComments = asyncHandler(
  async (req: Request, res: Response) => {
    const recipeId = req.params.recipeId;
    const comments = await commentService.getRecipeComments(recipeId);
    res.status(200).json({ message: "got comments for recipe", comments });
    return;
  },
);

export const getCommentReplies = asyncHandler(
  async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const comment = await commentService.getCommentById(commentId);

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.hasChildren) {
      const commentChildren =
        await commentService.getChildrenComments(commentId);
      res.status(200).json({
        message: "Fetched replies successfully",
        commentChildren,
      });
      return;
    }

    res.status(404).json({ message: "No replies to this comment" });
  },
);
