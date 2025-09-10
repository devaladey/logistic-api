import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

export const createProfile = catchAsync(async (req, res, next) => {
  const profile = await prisma.profile.create({
    data: {
      userId: req.params.id,
    },
  });

  sendSuccess(res, { data: profile, message: "Profile created successfully" });
});

export const getProfile = catchAsync(async (req, res, next) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: req.params.id,
    },
  });

  if (!profile) {
    return next(new AppError("Profile not found", 404));
  }

  sendSuccess(res, { message: "Profile fetched successfully", data: profile });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const profile = await prisma.profile.update({
    where: {
      userId: req.params.id,
    },
    data: {},
  });
  sendSuccess(res, { message: "Profile updated successfully", data: profile });
});

export const deleteProfile = catchAsync(async (req, res, next) => {
  await prisma.profile.delete({
    where: {
      userId: req.params.id,
    },
  });
  sendSuccess(res, { message: "Profile deleted successfully", data: {} });
});
