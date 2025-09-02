import { IRouter } from "express";
import authRoutes from "./auth-routes";
import { sendError } from "../utils/response";
import AppError from "../utils/app-error";

const baseUrl = (val: string) => `/api/v1/${val}`;

export const appRouter = (app: IRouter) => {
  app.use(baseUrl("auth"), authRoutes);

  app.use((req, res, next) => {
    next(
      new AppError(`Cannot find path(${req.originalUrl}) on this server`, 404)
    );
  });
};
