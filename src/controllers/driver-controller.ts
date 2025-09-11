import { Rolekey } from "../constants/roles";
import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

export const getDrivers = catchAsync(async (req, res, next) => {
  const drivers = await prisma.driver.findMany();

  sendSuccess(res, {
    message: "Driver fetched successfully",
    data: {
      results: drivers.length,
      drivers,
    },
  });
});

export const getDriver = catchAsync(async (req, res, next) => {
  const driver = await prisma.driver.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!driver) {
    return next(new AppError("Driver not found", 404));
  }

  sendSuccess(res, {
    message: "Driver fetched successfully",
    data: driver,
  });
});

export const createDriver = catchAsync(async (req, res, next) => {
  const driver = await prisma.driver.create({
    data: {
      userId: req.body.protectedObject?.id,
    },
  });

  await prisma.userRole.create({
    data: {
      user: { connect: { id: req.body.protectedObject.id } },
      role: { connect: { name: Rolekey.DRIVER } },
    },
  });

  sendSuccess(res, {
    message: "Driver created successfully",
    data: driver,
  });
});

export const updateDriver = catchAsync(async (req, res, next) => {
  const driver = await prisma.driver.update({
    where: {
      id: req.params.id,
    },
    data: {},
  });

  sendSuccess(res, {
    message: "Driver updated successfully",
    data: driver,
  });
});

export const deleteDriver = catchAsync(async (req, res, next) => {
  if (!req.body.protectedObject?.driver?.id) {
    return next(new AppError("You do not have a driver account", 400));
  }

  await prisma.driver.delete({
    where: {
      id: req.body.protectedObject?.driver?.id,
    },
  });

  await prisma.userRole.delete({
    where: {
      userId_roleId: {
        roleId: req.body.protectedObject?.roles?.find(
          (role: { role: { name: string } }) => role.role.name === Rolekey.DRIVER
        )?.roleId,
        userId: req.body.protectedObject.id,
      },
    },
  });

  sendSuccess(res, {
    message: "Driver deleted successfully",
    data: {},
  });
});
