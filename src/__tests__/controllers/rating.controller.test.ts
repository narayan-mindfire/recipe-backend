// src/__tests__/controllers/rating.controller.test.ts
import mongoose from "mongoose";
import { Request, Response } from "express";
import * as ratingController from "../../controllers/rating.controller";
import { ratingService } from "../../services/rating.service";
import { AuthRequest } from "../../types/types";
import { mock } from "node:test";

jest.mock("../../services/rating.service");

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.end = jest.fn();
  return res;
};

describe("Rating Controller", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return a rating for a user", async () => {
    const req = {
      params: { id: "recipeId" },
      user: { id: "userId" },
    } as unknown as AuthRequest;
    const res = mockRes();

    (ratingService.getRating as jest.Mock).mockResolvedValue({ rating: 5 });
    const next = mock.fn();
    await ratingController.getMyRating(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404); // should be 200 if message is "rating found"
  });

  it("should create a new rating", async () => {
    const req = {
      body: { recipeId: new mongoose.Types.ObjectId(), rating: 4 },
      user: { id: new mongoose.Types.ObjectId() },
    } as unknown as AuthRequest;
    const res = mockRes();

    (ratingService.createNewRating as jest.Mock).mockResolvedValue({});
    const next = mock.fn();
    await ratingController.createRating(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should edit a rating", async () => {
    const req = {
      params: { id: "ratingId" },
      body: { rating: 5 },
    } as unknown as Request;
    const res = mockRes();

    (ratingService.updateRating as jest.Mock).mockResolvedValue({});

    const next = mock.fn();
    await ratingController.editRating(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should delete a rating", async () => {
    const req = { params: { id: "ratingId" } } as unknown as Request;
    const res = mockRes();

    (ratingService.findRating as jest.Mock).mockResolvedValue({});
    (ratingService.deleteRating as jest.Mock).mockResolvedValue(undefined);
    const next = mock.fn();
    await ratingController.deleteRating(req, res, next);

    expect(res.status).toHaveBeenCalledWith(203);
    expect(res.end).toHaveBeenCalled();
  });
});
