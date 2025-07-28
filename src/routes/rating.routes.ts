import express, { Request, Response } from "express";

const ratingRoutes = express.Router();

// POST /ratings - createRating
ratingRoutes.post("/", (req: Request, res: Response) => {
  res.send("createRating is working");
});

// PATCH /ratings/:id - updateRating
ratingRoutes.patch("/:id", (req: Request, res: Response) => {
  const ratingId = req.params.id;
  res.send(`updateRating is working for rating ID ${ratingId}`);
});

// DELETE /ratings/:id - deleteRating
ratingRoutes.delete("/:id", (req: Request, res: Response) => {
  const ratingId = req.params.id;
  res.send(`deleteRating is working for rating ID ${ratingId}`);
});

export default ratingRoutes;
