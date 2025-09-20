import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";
import { validateInput } from "../validators";
import {
  passwordValidateSchema,
  signupValidateSchema,
} from "../validators/user/user-validator";
import { NextFunction, Request, Response } from "express";

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
      userId_userAgent: {
        userId: user.id,
        userAgent: req.headers["user-agent"] || "unknown",
      },
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
      userAgent: req.headers["user-agent"] || "unknown",
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

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findFirst({
    where: {
      phone: req.body.phone,
    },
  });

  if (!user) {
    return next(new AppError("There is not user with this phone number", 400));
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpExpiresIn = new Date(Date.now() + 10 * 60 * 1000);
  const token = await prisma.otpToken.upsert({
    where: {
      userId_reason: {
        reason: "login",
        userId: user.id,
      },
    },
    create: {
      token: crypto.createHash("sha256").update(otp).digest("hex"),
      expiresAt: otpExpiresIn,
      reason: "login",
      userId: user.id,
    },
    update: {
      token: crypto.createHash("sha256").update(otp).digest("hex"),
      expiresAt: otpExpiresIn,
    },
  });

  sendSuccess(res, {
    message: `Otp has been sent to ${user.phone}`,
    data: { otp },
  });
});

export const resetPasword = catchAsync(async (req, res, next) => {
  validateInput(req.body, passwordValidateSchema);

  const user = await prisma.user.findFirst({
    where: {
      phone: req.body.phone,
      otpToken: {
        some: {
          token: crypto.createHash("sha256").update(req.body.otp).digest("hex"),
        },
      },
    },
    include: {
      otpToken: true,
    },
  });

  if (
    !user ||
    user.otpToken.some((el) => new Date(el.expiresAt).getTime() < Date.now())
  ) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordChangedAt: new Date(Date.now()),
    },
  });

  sendSuccess(res, {
    message: "Password reset successful.",
    data: undefined,
  });
});

export const protect = catchAsync(async (req: Request, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Please login to access this route", 401));
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: {
      id: decoded?.id,
    },
    include: {
      admin: true,
      customer: true,
      driver: true,
      profile: true,
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return next(new AppError("Invalid token or user does not exist", 401));
  }

  if (
    user.passwordChangedAt &&
    parseInt(`${new Date(user.passwordChangedAt).getTime() / 1000}`) >
      (decoded.iat || 0)
  ) {
    return next(
      new AppError("User recently changed password, Login again!", 401)
    );
  }

  if (
    user.jwtIssuedAt &&
    parseInt(`${new Date(user.jwtIssuedAt).getTime() / 1000}`) >
      (decoded.iat || 0)
  ) {
    return next(new AppError("User recently required a new token", 401));
  }

  req.body = req.body || {};
  req.body.protectedObject = user;

  next();
});

export const restrictTo = (requiredPermissions: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const grantedPermissions: string[] = [];
    req.body?.protectedObject?.roles?.forEach((el: any) => {
      el?.role?.permissions?.forEach(
        (el: { permission: { key: string; name: string } }) => {
          grantedPermissions.push(el?.permission?.key);
        }
      );
    });

    const restrictedPermission = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    if (!restrictedPermission.some((el) => grantedPermissions.includes(el))) {
      return next(
        new AppError(
          "You do not have the permission to access this route.",
          403
        )
      );
    }

    next();
  };
};
