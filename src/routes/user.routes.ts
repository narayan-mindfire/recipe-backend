import express, { Request, Response } from "express";

const userRouter = express.Router();

userRouter.get("/", (_req: Request, res: Response) => {
  res.send("get users is working");
});

userRouter.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) res.send(`get user is working for ${id}`);
});

export default userRouter;
