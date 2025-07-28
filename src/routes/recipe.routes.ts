import express, { Request, Response } from "express";

const recipeRoutes = express.Router();

// GET /recipes - getRecipes (with optional search, sort, filter)
recipeRoutes.get("/", (_req: Request, res: Response) => {
  res.send("getRecipes with search/sort/filter is working");
});

// GET /recipes/:id - getSingleRecipe
recipeRoutes.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`getSingleRecipe is working for recipe ID ${id}`);
});

recipeRoutes.get("/:id/comments", (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`getting all parent comments for recipe with id : ${id}`);
});
// POST /recipes - createRecipe (private)
recipeRoutes.post("/", (req: Request, res: Response) => {
  res.send("createRecipe is working (private route)");
});

// PUT /recipes/:id - update entire recipe (private)
recipeRoutes.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(
    `update entire recipe is working for recipe ID ${id} (private route)`,
  );
});

// PATCH /recipes/:id - update avgRating, ratingCount (internal only)
recipeRoutes.patch("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(
    `update avgRating & ratingCount is working for recipe ID ${id} (internal use only)`,
  );
});

// DELETE /recipes/:id - deleteRecipe (private)
recipeRoutes.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`deleteRecipe is working for recipe ID ${id} (private route)`);
});

export default recipeRoutes;
