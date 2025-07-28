import { Types } from "mongoose";
import { z } from "zod";

export const recipeSchemaZ = z.object({
  userId: z.instanceof(Types.ObjectId),
  title: z.string(),
  description: z.string().optional(),
  preparationTime: z.number().int().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
  recipeImage: z.string().optional(),
  averageRating: z.number().optional(),
  numberOfRatings: z.number().int().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const userSchemaZ = z.object({
  fname: z.string(),
  lname: z.string(),
  email: z.email(),
  password: z.string(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const commentSchemaZ = z.object({
  userId: z.instanceof(Types.ObjectId),
  recipeId: z.instanceof(Types.ObjectId),
  parentCommentId: z.instanceof(Types.ObjectId).nullable().optional(),
  hasChildren: z.boolean().optional(),
  comment: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const ratingSchemaZ = z.object({
  userId: z.instanceof(Types.ObjectId),
  recipeId: z.instanceof(Types.ObjectId),
  rating: z.number().int().min(1).max(5),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Rating = z.infer<typeof ratingSchemaZ>;

export type Comment = z.infer<typeof commentSchemaZ>;

export type User = z.infer<typeof userSchemaZ>;

export type Recipe = z.infer<typeof recipeSchemaZ>;
