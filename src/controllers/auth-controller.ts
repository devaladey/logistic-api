import crypto from "crypto";
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
  // This is password verification
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

  // OTP verification loading





  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "90d",
  });

  const newRefreshToken = crypto.randomBytes(16).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  const refreshToken = await prisma.refreshToken.upsert({
    where: {
      userId_userAgent: { userId: user.id, userAgent: req.headers['user-agent'] || 'unknown' },
    },
    update: {
      token: hashedToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ipAddress: req.ip,
      appVersion: req.body.appVersion || null,
    },
    create: {
      token: hashedToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ipAddress: req.ip,
      device: req.body.device,
      appVersion: req.body.appVersion || null,
      userId: user.id,
      userAgent: req.headers['user-agent'] || 'unknown',
    },
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
    data: {
      token,
      updatedUser,
      refreshToken: newRefreshToken,
    },
    message: "Login Successful",
  });
});
