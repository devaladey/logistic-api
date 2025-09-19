import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

// For customers
export const createRequestForQuotes = catchAsync(async (req, res, next) => {
  sendSuccess(res, {
    message: "Request for quotes created successfully.",
  });
});

export const getAllRequestsForQuotes = catchAsync(async (req, res, next) => {
  const rfquotes = await prisma.requestForQuote.findMany();

  sendSuccess(res, {
    message: "Requests for quotes fetched successfully",
    data: {
      results: rfquotes.length,
      data: rfquotes,
    },
  });
});

export const getCustomerRFQs = catchAsync(async (req, res, next) => {
  const rfquotes = await prisma.requestForQuote.findMany();

  sendSuccess(res, {
    message: "Requests for quotes fetched successfully",
    data: {
      results: rfquotes.length,
      data: rfquotes,
    },
  });
});

export const getAvailableRFQs = catchAsync(async (req, res, next) => {
  const rfquotes = await prisma.requestForQuote.findMany();

  sendSuccess(res, {
    message: "Requests for quotes fetched successfully",
    data: {
      results: rfquotes.length,
      data: rfquotes,
    },
  });
});

export const getRequestForQuoteById = catchAsync(async (req, res, next)=> {

});

export const updateRequestForQuote = catchAsync(async (req, res, next)=> {

});

export const deleteRequestForQuote = catchAsync(async (req, res, next)=> {

});

export const cancelRFQ = catchAsync(async (req, res, next)=> {

});

export const searchRFQs = catchAsync(async (req, res, next)=> {

});

export const respondToInvitation = catchAsync(async (req, res, next)=> {

});

export const updateRFQStatus = catchAsync(async (req, res, next)=> {

});

