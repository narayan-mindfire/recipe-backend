import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";

const port = process.env.PORT;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

connectDB();
const app: Express = express();

app.use(
  cors({
    origin: [process.env.LOCAL_CLIENT_URL!],
    credentials: true,
  }),
);

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/api/v1", router);

app.use(errorHandler);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.listen(port, () => {
  // console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});

app.use("/", (req: Request, res: Response) => {
  res.send("route working");
});

export default app;
