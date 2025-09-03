import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";



export const signUp = catchAsync(async (req, res, next) => {
  const { email, phone, name, signupMethod, password, confirmPassword } =
    req.body;
    

  const newUser = await prisma.user.create({
    data: {
      name: name,
      signupMethod: signupMethod,
      phone: phone,
      email: email,
      passwordHash: bcrypt.hashSync(password, 12),
    },
  });

  sendSuccess(res, {
    code: 201,
    data: newUser,
    message: "Account created successfully.",
  });
});
