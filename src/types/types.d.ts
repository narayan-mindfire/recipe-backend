import { Request } from "express";
import { Document } from "mongoose";
import { User } from "../zod/schemas";
export interface AuthRequest extends Request {
  user: Omit<User & Document, "password">;
}

export type RecipeFilters = {
  ingredients?: { $all: string[] };
  $and?: Array<{ ingredients: { $elemMatch: { $regex: RegExp } } }>;
  averageRating?: { $gte?: number };
  preparationTime?: { $lte?: number };
};
