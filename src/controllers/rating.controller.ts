import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ratingService } from "../services/rating.service";
import { ratingSchemaZ } from "../zod/schemas";
import mongoose from "mongoose";
import { AuthRequest } from "../types/types";

export const getMyRating = asyncHandler(async (req: Request, res: Response) => {
  const myRating = await ratingService.getRating(
    req.params.id,
    (req as AuthRequest).user.id,
  );
  if (!myRating) {
    res.status(404).json({ message: "could not find rating" });
    return;
  }
  res.status(200).json({ message: "rating found", myRating });
});

export const createRating = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      userId: new mongoose.Types.ObjectId((req as AuthRequest).user.id),
      recipeId: new mongoose.Types.ObjectId(req.body.recipeId),
    };
    const validate = ratingSchemaZ.parse(payload);
    const rating = await ratingService.createNewRating(validate);
    if (!rating) {
      res.status(500).json({ message: "could not create rating" });
    }
    res.status(201).json({ rating });
  },
);

export const editRating = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const validate = ratingSchemaZ.partial().parse(req.body);
  const rating = await ratingService.updateRating(id, validate);
  res.status(200).json({ rating });
});

export const deleteRating = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const rating = await ratingService.findRating(id);
    if (!rating) {
      res.status(404).json({ message: "could not find rating to be deleted" });
      return;
    }
    await ratingService.deleteRating(id);
    res.status(203).end();
  },
);
