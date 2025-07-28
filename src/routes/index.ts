import { Router } from "express";
// import appointmentRouter from "./appointments.routes";
// import slotRouter from "./slots.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import commentRoutes from "./comment.routes";
import ratingRoutes from "./rating.routes";
import recipeRoutes from "./recipe.routes";

// root router
const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/comments", commentRoutes);
router.use("/recipes", recipeRoutes);
router.use("/ratings", ratingRoutes);
export default router;
