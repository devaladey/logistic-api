import { Response } from "express";

type SuccessResponse<T> = {
  data?: T;
  message?: string;
  code?: number;
};

export const sendSuccess = <T>(
  res: Response,
  { data, message = "Success", code=200 }: SuccessResponse<T>
) => {
  return res.status(code).json({ success: true, message, data });
};

type ErrorResponse = {
  message?: string;
  code?: number;
  details?: any;
  error?: any;
  stackTrace?: any;
};

export const sendError = (
  res: Response,
  { message = "Error", code = 500, details, error, stackTrace }: ErrorResponse
) => {
  return res.status(code).json({
    success: false,
    message,
    error: { code, details },
    devError: error,
    stackTrace
  });
};
