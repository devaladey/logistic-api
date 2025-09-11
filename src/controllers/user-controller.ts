import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

export const getUsers = catchAsync(async (req, res, next) => {

  const users = await prisma.user.findMany();
  sendSuccess(res, {
    message: "Users Fetched Succesfully",
    data: {
      results: users.length,
      users
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });
  sendSuccess(res, { message: "User deleted successfully", data: undefined });
});
