import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

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
      userId: req.body.userId,
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
  await prisma.customer.delete({
    where: {
      id: req.params.id,
    },
  });

  sendSuccess(res, {
    message: "Customer deleted successfully",
    data: {},
  });
});
