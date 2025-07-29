import express from "express";
import {
  createRating,
  editRating,
  deleteRating,
  getMyRating,
} from "../controllers/rating.controller";
import { protect } from "../middlewares/authMiddleware";
const ratingRoutes = express.Router();

ratingRoutes.get("/:id", protect, getMyRating);

// POST /ratings - createRating
ratingRoutes.post("/", protect, createRating);

// PATCH /ratings/:id - updateRating
ratingRoutes.put("/:id", protect, editRating);

// DELETE /ratings/:id - deleteRating
ratingRoutes.delete("/:id", protect, deleteRating);

export default ratingRoutes;
