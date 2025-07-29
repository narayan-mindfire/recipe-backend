import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

/**
 *
 * This function catches errors thrown in the application,
 * sets an appropriate HTTP status code, and responds with a JSON
 * object containing the error message and (optionally) the stack trace.
 *
 * @param {Error} err - The error object caught by Express.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 */
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  if (err.message.split(" ")[0] === "E11000") {
    statusCode = 400;
    err.message = `cannot have duplicates`;
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    err.message = `Resource not found with id: ${err.value}`;
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
