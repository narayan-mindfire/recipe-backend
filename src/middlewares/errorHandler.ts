import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;
  let errors = undefined;

  if (err.message.startsWith("E11000")) {
    statusCode = 400;
    message = `Cannot have duplicates`;
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Resource not found with id: ${err.value}`;
  }

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Input validation failed";
    errors = (err as ZodError).issues;
  }

  res.status(statusCode).json({
    message,
    ...(errors ? { errors } : {}),
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
