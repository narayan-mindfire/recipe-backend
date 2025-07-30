// src/__tests__/controllers/comment.controller.test.ts
import mongoose from "mongoose";
import { Request, Response } from "express";
import { commentService } from "../../services/comment.service";
import * as commentController from "../../controllers/comment.controller";
import { AuthRequest } from "../../types/types";
import { mock } from "node:test";

jest.mock("../../services/comment.service");

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.end = jest.fn();
  return res;
};

describe("Comment Controller", () => {
  afterEach(() => jest.clearAllMocks());

  it("should create a comment", async () => {
    const userId = new mongoose.Types.ObjectId();
    const req = {
      body: {
        recipeId: new mongoose.Types.ObjectId(),
        comment: "Nice Recipe!",
      },
      user: { id: userId },
    } as unknown as AuthRequest;

    const res = mockRes();
    const next = jest.fn();

    (commentService.createNewComment as jest.Mock).mockResolvedValue({});
    (commentService.updateComment as jest.Mock).mockResolvedValue(undefined);

    await commentController.createComment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should edit a comment", async () => {
    const comment = {
      userId: new mongoose.Types.ObjectId(),
      comment: "Old Comment",
    };

    const req = {
      params: { id: "123" },
      body: { comment: "Updated Comment" },
      user: { id: comment.userId },
    } as unknown as AuthRequest;
    const res = mockRes();
    const next = jest.fn();

    (commentService.getCommentById as jest.Mock).mockResolvedValue(comment);
    (commentService.updateComment as jest.Mock).mockResolvedValue({});

    await commentController.editComment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should delete a comment", async () => {
    const comment = {
      userId: new mongoose.Types.ObjectId(),
      comment: "Some comment",
    };

    const req = {
      params: { id: "123" },
      user: { id: comment.userId },
    } as unknown as AuthRequest;

    const res = mockRes();
    const next = jest.fn();

    (commentService.getCommentById as jest.Mock).mockResolvedValue(comment);
    (commentService.removeComment as jest.Mock).mockResolvedValue(undefined);

    await commentController.deleteComment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it("should return recipe comments", async () => {
    const req = { params: { recipeId: "recipe123" } } as unknown as Request;
    const res = mockRes();

    (commentService.getRecipeComments as jest.Mock).mockResolvedValue([]);
    const nxt = mock.fn();
    await commentController.getRecipeComments(req, res, nxt);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should return replies if comment has children", async () => {
    const req = { params: { id: "comment123" } } as unknown as Request;
    const res = mockRes();

    (commentService.getCommentById as jest.Mock).mockResolvedValue({
      hasChildren: true,
    });
    (commentService.getChildrenComments as jest.Mock).mockResolvedValue([]);
    const nxt = mock.fn();
    await commentController.getCommentReplies(req, res, nxt);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
