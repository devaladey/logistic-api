import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

export const createPermission = catchAsync(async (req, res, next) => {
  const permission = await prisma.permission.create({
    data: {
      key: req.body.key,
      module: req.body.module || "",
      name: req.body.name,
    },
  });

  sendSuccess(res, {
    message: "Permission created successfully",
    data: {
      data: permission,
    },
  });
});

export const getPermissions = catchAsync(async (req, res, next) => {
  const permissions = await prisma.permission.findMany();

  sendSuccess(res, {
    message: "Permissions fetched successfully",
    data: {
      results: permissions.length,
      data: permissions,
    },
  });
});

export const getPermission = catchAsync(async (req, res, next) => {
  const permission = await prisma.permission.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!permission) {
    return next(new AppError("Permission not found", 404));
  }

  sendSuccess(res, {
    message: "Permission fetched successfully",
    data: {
      data: permission,
    },
  });
});

export const updatePermission = catchAsync(async (req, res, next) => {
  const permission = await prisma.permission.update({
    where: {
      id: req.params.id,
    },
    data: {
      key: req.body.key,
      name: req.body.name,
      module: req.body.module,
      description: req.body.description,
    },
  });

  sendSuccess(res, {
    message: "Permission updated successfully.",
    data: {
      data: permission,
    },
  });
});

export const deletePermission = catchAsync(async (req, res, next) => {
  await prisma.permission.delete({
    where: {
      id: req.params.id,
    },
  });

  sendSuccess(res, {
    message: "Permission deleted successfully",
    data: {},
  });
});
