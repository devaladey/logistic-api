import { Request } from "express";
import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";
import { Rolekey } from "../constants/roles";

export const getCustomers = catchAsync(async (req, res, next) => {
  const customers = await prisma.customer.findMany();

  sendSuccess(res, {
    message: "Customers fetched successfully.",
    data: {
      results: customers.length,
      customers,
    },
  });
});

export const getCustomer = catchAsync(async (req, res, next) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!customer) {
    return next(new AppError("Customer not found.", 404));
  }

  sendSuccess(res, {
    message: "Customer fetched successfully",
    data: customer,
  });
});

export const createCustomer = catchAsync(async (req, res, next) => {
  const customer = await prisma.customer.create({
    data: {
      userId: req.body.protectedObject.id,
    },
  });

  await prisma.userRole.create({
    data: {
      user: { connect: { id: req.body.protectedObject.id } },
      role: { connect: { name: Rolekey.CUSTOMER } },
    },
  });

  sendSuccess(res, {
    message: "Customer created successfully",
    data: customer,
  });
});

export const updateCustomer = catchAsync(async (req, res, next) => {
  const customer = await prisma.customer.update({
    where: {
      id: req.params.id,
    },
    data: {},
  });

  sendSuccess(res, {
    message: "Customer updated successfully",
    data: customer,
  });
});

export const deleteCustomer = catchAsync(async (req, res, next) => {
  if (!req.body.protectedObject?.customer?.id) {
    return next(new AppError("You do not have a customer account", 400));
  }

  await prisma.customer.delete({
    where: {
      id: req.body.protectedObject?.customer?.id,
    },
  });

  await prisma.userRole.delete({
    where: {
      userId_roleId: {
        roleId: req.body.protectedObject?.roles?.find(
          (role: { role: { name: string } }) =>
            role.role.name === Rolekey.CUSTOMER
        )?.roleId,
        userId: req.body.protectedObject?.id,
      },
    },
  });

  sendSuccess(res, {
    message: "Customer deleted successfully",
    data: {},
  });
});
