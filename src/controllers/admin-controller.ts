import { Rolekey } from "../constants/roles";
import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

export const createAdmin = catchAsync(async (req, res, next) => {
  const admin = await prisma.admin.create({
    data: {
      userId: req.body.protectedObject?.id,
    },
  });

  await prisma.userRole.create({
    data: {
      user: { connect: { id: req.body.protectedObject.id } },
      role: { connect: { name: Rolekey.ADMIN } },
    },
  });

  sendSuccess(res, {
    message: "Admin created successfully",
    data: admin,
  });
});

export const getAdmins = catchAsync(async (req, res, next) => {
  const admin = await prisma.admin.findMany();

  sendSuccess(res, {
    message: "Admin created successfully",
    data: {
      results: admin.length,
      data: admin,
    },
  });
});

export const getAdmin = catchAsync(async (req, res, next) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  sendSuccess(res, {
    message: "Admin created successfully",
    data: {
      data: admin,
    },
  });
});

export const updateAdmin = catchAsync(async (req, res, next) => {
  const admin = await prisma.admin.update({
    where: {
      id: req.params.id,
    },
    data: {},
  });

  sendSuccess(res, {
    message: "Admin updated successfully",
    data: admin,
  });
});

export const deleteAdmin = catchAsync(async (req, res, next) => {

  if(!req.body.protectedObject?.admin?.id) {
    return next(new AppError("You do not have an admin account", 400));
  }

  await prisma.admin.delete({
    where: {
      id: req.body.protectedObject?.admin?.id,
    },
  });

  await prisma.userRole.delete({
    where: {
      userId_roleId: {
        roleId: req.body.protectedObject?.roles?.find(
          (role: { role: { name: string } }) => role.role.name === Rolekey.ADMIN
        )?.roleId,
        userId: req.body.protectedObject.id,
      },
    },
  });

  sendSuccess(res, {
    message: "Admin deleted successfully",
    data: {},
  });
});
