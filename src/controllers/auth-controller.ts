import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";
import { validateInput } from "../utils/validator";

export const userValidationSchema = {
  name: { required: true, minLength: 2, maxLength: 50 },
  email: { required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, minLength: 8 },
  confirmPassword: {
    custom: (val: any, data: Record<string, any>) => {
      if (val !== data?.password) {
        throw new AppError("Passwords do not match.", 400);
      }
    },
  },
  phone: { regex: /^\d{10,15}$/ }, // optional
  signupMethod: { required: true },
};

export const signUp = catchAsync(async (req, res, next) => {
  validateInput(req.body, userValidationSchema);

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
