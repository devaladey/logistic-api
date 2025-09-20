import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response";
import AppError from "../utils/app-error";
import { Prisma } from "../generated/prisma";
import { SignupMethodEnum } from "../lib/prisma";

const enumFieldMap: Record<string, any> = {
  signupMethod: SignupMethodEnum,
};

const handleDuplicateError = (err: any) => {
  const modelName = err?.meta?.modelName;
  const target = err?.meta?.target[0];
  return new AppError(`A ${modelName} with this ${target} already exists`, 400);
};

const handleValidationError = (err: any) => {
  const msg = err?.message;
  let message = "Invalid input provided. Please check your data.";

  // Missing field
  const missingMatch = msg?.match(/Argument `(\w+)` is missing/);
  if (missingMatch) {
    const field = missingMatch[1];
    message = `The '${field}' field is required. Please provide a value.`;
  }
  // Type mismatch
  else {
    const typeMatch = msg?.match(
      /Argument `(\w+)`: Invalid value provided\. Expected (.+?), provided (\w+)\./
    );
    if (typeMatch) {
      const field = typeMatch[1];
      const expected = typeMatch[2];
      const provided = typeMatch[3];
      message = `Invalid type for '${field}': expected ${expected}, but received ${provided}.`;
    }
    // Enum mismatch
    else {
      const enumMatch = msg?.match(/Invalid value for argument `(\w+)`/);
      if (enumMatch) {
        const field = enumMatch[1];
        const prismaEnum = enumFieldMap[field];
        if (prismaEnum) {
          const validValues = Object.values(prismaEnum).join(", ");
          message = `Invalid value for '${field}'. Accepted values: ${validValues}`;
        }
      }
    }
  }

  return new AppError(message, 400);
};

const handleNotFoundError = (err: any) => {
  const modelName = err?.meta?.modelName || "Record";
  // console.log(err);
  // const reason = err?.meta?.cause || "Record not found";
  return new AppError(`${modelName} not found`, 404);
};

const handleJwtTokenError = () => {
  return new AppError(`Invalid token, please login again`, 401);
};

const handleTokenExpiredError = () => {
  return new AppError(`Login token expired. Please log in again!`, 401);
};

const handleRecordNotFound = (err: any) => {
  return new AppError(`${err?.meta?.modelName} not found.`, 404);
};

export const errorController = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: any;
  error = { ...err };
  error.message = err.message;
  error.statusCode = err instanceof AppError ? err.statusCode : 500;

  console.log("This is the error: ", error);

  if (
    (err as Prisma.PrismaClientKnownRequestError)?.meta?.cause ===
    "No record was found for a query."
  )
    error = handleRecordNotFound(err);
  if ((err as Prisma.PrismaClientKnownRequestError)?.code === "P2002")
    error = handleDuplicateError(err);
  if (err.name === "PrismaClientValidationError")
    error = handleValidationError(err);
  if ((err as Prisma.PrismaClientKnownRequestError)?.code === "P2025")
    error = handleNotFoundError(err);
  if (err.name === "JsonWebTokenError") error = handleJwtTokenError();
  if (err.name === "TokenExpiredError") error = handleTokenExpiredError();

  sendError(res, {
    code: error.statusCode,
    message: error?.isOperational ? error.message : "Something went wrong!",
    error: err,
    stackTrace: error.stack,
  });
};
