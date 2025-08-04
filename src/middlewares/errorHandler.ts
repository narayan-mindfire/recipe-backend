import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";

/**
 * @desc    Centralized error-handling middleware for Express.
 *          Handles Mongoose CastErrors, Zod validation errors,
 *          and MongoDB duplicate key errors.
 *
 * @param   err - The error object thrown in any middleware/controller
 * @param   _req - The incoming Express request object (unused)
 * @param   res - The outgoing Express response object
 * @param   _next - The next middleware function (unused but required)
 *
 * @returns Sends a JSON response with appropriate status code and message.
 */
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
