import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";
import { validateInput } from "../validators";
import { signupValidateSchema } from "../validators/user/user-validator";

export const signUp = catchAsync(async (req, res, next) => {
  validateInput(req.body, signupValidateSchema);
  const { email, phone, name, signupMethod, password } = req.body;

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

export const login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return next(new AppError("Please provide phone and password", 400));
  }

  const user = await prisma.user.findUnique({
    where: {
      phone: req.body.phone,
    },
  });

  if (
    !user ||
    (user.passwordHash && !(await bcrypt.compare(password, user.passwordHash)))
  ) {
    return next(new AppError("Phone number or password is incorrect", 400));
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "90d",
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      jwtIssuedAt: new Date(Date.now()),
    },
  });

  sendSuccess(res, {
    data: { token, updatedUser },
    message: "Login Successful",
  });
});
