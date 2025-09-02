import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response";
import AppError from "../utils/app-error";

export const errorController = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return sendError(res, {
      code: err.statusCode,
      message: err.message,
      error: err,
      stackTrace: err.stack,
    });
  }
};
