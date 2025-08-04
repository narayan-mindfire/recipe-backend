import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { commentService } from "../services/comment.service";
import { AuthRequest } from "../types/types";
import { commentSchemaZ } from "../zod/schemas";
import { Types } from "mongoose";

/**
 * @desc    Create a new comment on a recipe or reply to a comment
 * @route   POST /api/comments
 * @access  Private
 */
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

/**
 * @desc    Edit a comment (only by the owner)
 * @route   PUT /api/comments/:id
 * @access  Private
 */
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

/**
 * @desc    Delete a comment (only by the owner)
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
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

/**
 * @desc    Get all top-level comments for a recipe
 * @route   GET /api/comments/:recipeId
 * @access  Public
 */
export const getRecipeComments = asyncHandler(
  async (req: Request, res: Response) => {
    const recipeId = req.params.recipeId;
    const comments = await commentService.getRecipeComments(recipeId);
    res.status(200).json({ message: "got comments for recipe", comments });
    return;
  },
);

/**
 * @desc    Get replies to a specific comment (if it has children)
 * @route   GET /api/comments/replies/:id
 * @access  Public
 */
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
