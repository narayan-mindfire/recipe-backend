// src/__tests__/services/comment.service.test.ts

import { commentService } from "../../services/comment.service";
import { commentRepository } from "../../repositories/comment.repository";
import { Types } from "mongoose";
import { Comment } from "../../zod/schemas";

jest.mock("../../repositories/comment.repository");

const fakeComment: Comment = {
  userId: new Types.ObjectId(),
  recipeId: new Types.ObjectId(),
  comment: "This is a test comment",
  hasChildren: false,
  parentCommentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Comment Service", () => {
  afterEach(() => jest.clearAllMocks());

  it("should create a new comment", async () => {
    (commentRepository.create as jest.Mock).mockResolvedValue(fakeComment);

    const result = await commentService.createNewComment(fakeComment);

    expect(commentRepository.create).toHaveBeenCalledWith(fakeComment);
    expect(result).toEqual(fakeComment);
  });

  it("should get comment by id", async () => {
    (commentRepository.findById as jest.Mock).mockResolvedValue(fakeComment);

    const result = await commentService.getCommentById("123");

    expect(commentRepository.findById).toHaveBeenCalledWith("123");
    expect(result).toEqual(fakeComment);
  });

  it("should update comment", async () => {
    const updatedData: Partial<Comment> = { comment: "Updated comment" };

    (commentRepository.update as jest.Mock).mockResolvedValue({
      ...fakeComment,
      ...updatedData,
    });

    const result = await commentService.updateComment("123", updatedData);

    expect(commentRepository.update).toHaveBeenCalledWith("123", updatedData);
    expect(result?.comment).toBe("Updated comment");
  });

  it("should remove comment", async () => {
    (commentRepository.delete as jest.Mock).mockResolvedValue(undefined);

    await expect(commentService.removeComment("123")).resolves.toBeUndefined();
    expect(commentRepository.delete).toHaveBeenCalledWith("123");
  });

  it("should get recipe comments", async () => {
    const comments = [fakeComment];

    (commentRepository.findRecipeComments as jest.Mock).mockResolvedValue(
      comments,
    );

    const result = await commentService.getRecipeComments("recipe123");

    expect(commentRepository.findRecipeComments).toHaveBeenCalledWith(
      "recipe123",
    );
    expect(result).toEqual(comments);
  });

  it("should get child comments", async () => {
    const replies = [fakeComment];

    (commentRepository.findChildComments as jest.Mock).mockResolvedValue(
      replies,
    );

    const result = await commentService.getChildrenComments("parent123");

    expect(commentRepository.findChildComments).toHaveBeenCalledWith(
      "parent123",
    );
    expect(result).toEqual(replies);
  });
});
