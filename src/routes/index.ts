import { Router } from "express";

import authRouter from "./auth.routes";
import commentRoutes from "./comment.routes";
import ratingRoutes from "./rating.routes";
import recipeRoutes from "./recipe.routes";
import userRouter from "./user.routes";

// root router
const router = Router();

router.use("/auth", authRouter);
router.use("/comments", commentRoutes);
router.use("/recipes", recipeRoutes);
router.use("/ratings", ratingRoutes);
router.use("/users", userRouter);
export default router;
