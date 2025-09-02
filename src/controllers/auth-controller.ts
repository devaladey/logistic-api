import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

const defaultCreateAccount = ()=> {};

export const signUp = catchAsync(async (req, res, next) => {
  const { email, phone, name, signupMethod, password, confirmPassword } =
    req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return next(new AppError("User Already Exists", 400));
  }

  const newUser = await prisma.user.create({
    data: {
      name: name,
      signupMethod: signupMethod,
      phone: phone,
      email: email,
      passwordHash: password,
    },
  });

  sendSuccess(res, {
    code: 201,
    data: newUser,
    message: "Account created successfully.",
  });
});
