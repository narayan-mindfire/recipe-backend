import express, { Request, Response } from "express";
import {
  createRecipe,
  editRecipe,
  getRecipeById,
  getRecipes,
} from "../controllers/recipe.controller";

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

recipeRoutes.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`deleteRecipe is working for recipe ID ${id} (private route)`);
});

export default recipeRoutes;
