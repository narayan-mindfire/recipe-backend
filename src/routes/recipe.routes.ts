import express, { Request, Response } from "express";
import {
  createRecipe,
  deleteRecipe,
  editRecipe,
  getRecipeById,
  getRecipes,
} from "../controllers/recipe.controller";
import { protect } from "../middlewares/authMiddleware";

const recipeRoutes = express.Router();

recipeRoutes.get("/", getRecipes);

recipeRoutes.get("/:id", getRecipeById);

// recipeRoutes.get("/:id/comments", (req: Request, res: Response) => {
//   const id = req.params.id;
//   res.send(`getting all parent comments for recipe with id : ${id}`);
// });

recipeRoutes.post("/", createRecipe);

recipeRoutes.put("/:id", editRecipe);

recipeRoutes.patch("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(
    `update avgRating & ratingCount is working for recipe ID ${id} (internal use only)`,
  );
});

recipeRoutes.delete("/:id", protect, deleteRecipe);

export default recipeRoutes;
