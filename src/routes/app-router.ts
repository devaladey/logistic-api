import { IRouter } from "express";
import adminRoutes from "./admin-routes";
import authRoutes from "./auth-routes";
import customerRoutes from "./customer-routes";
import driverRoutes from "./driver-routes";
import permissionRoutes from "./permission-routes";
import reqForQuotesRoutes from "./rfquote-routes";
import roleRoutes from "./role-routes";
import userRoutes from "./user-routes";
import AppError from "../utils/app-error";

const baseUrl = (val: string) => `/api/v1/${val}`;

export const appRouter = (app: IRouter) => {
  app.use(baseUrl("admin"), adminRoutes);
  app.use(baseUrl("auth"), authRoutes);
  app.use(baseUrl("customer"), customerRoutes);
  app.use(baseUrl("driver"), driverRoutes);
  app.use(baseUrl("permission"), permissionRoutes);
  app.use(baseUrl("rfquote"), reqForQuotesRoutes);
  app.use(baseUrl("role"), roleRoutes);
  app.use(baseUrl("user"), userRoutes);

  app.use((req, res, next) => {
    next(
      new AppError(`Cannot find path(${req.originalUrl}) on this server`, 404)
    );
  });
};
