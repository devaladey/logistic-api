import { prisma } from "../lib/prisma";
import AppError from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { sendSuccess } from "../utils/response";

// For customer
export const createRequestForQuotes = catchAsync(async (req, res, next) => {
  const rfquote = await prisma.$transaction(async (txn) => {
    const pickupLocation = await txn.location.upsert({
      where: {
        latitude_longitude: {
          latitude: req.body.pickupLatitude,
          longitude: req.body.pickupLongitude,
        },
      },
      create: {
        address: req.body.pickupAaddress,
        city: req.body.pickupCity,
        country: req.body.pickupCountry,
        state: req.body.pickupState,
        latitude: req.body.pickupLatitude,
        longitude: req.body.pickupLongitude,
      },
      update: {},
    });

    const dropLocation = await txn.location.upsert({
      where: {
        latitude_longitude: {
          latitude: req.body.dropLatitude,
          longitude: req.body.dropLongitude,
        },
      },
      create: {
        address: req.body.dropAaddress,
        city: req.body.dropCity,
        country: req.body.dropCountry,
        state: req.body.dropState,
        latitude: req.body.dropLatitude,
        longitude: req.body.dropLongitude,
      },
      update: {},
    });

    return await txn.requestForQuote.create({
      data: {
        pickupTime: new Date(req.body.pickupTime),
        pickupDate: new Date(req.body.pickupTime),
        customerId: req.body?.protectedObject?.customer?.id,
        dropLocationId: dropLocation.id,
        pickupLocationId: pickupLocation.id,
        dispatchMode: req.body.dispatchMode,
        package: {
          create: req.body.packages?.map((pkg: any) => ({
            description: pkg?.description,
            dimensions: pkg?.dimensions,
            fragile: pkg.fragile,
            weight: pkg.weight ? parseFloat(pkg.weight) : 0,
            status: pkg.status,
          })),
        },
      },
      include: {
        pickupLocation: true,
        dropLocation: true,
        package: true,
      },
    });
  });

  sendSuccess(res, {
    message: "Request for quotes created successfully.",
    data: {
      data: rfquote,
    },
  });
});

// For Admin
export const getAllRequestsForQuotes = catchAsync(async (req, res, next) => {
  const rfquotes = await prisma.requestForQuote.findMany({
    include: {
      pickupLocation: true,
      dropLocation: true,
      package: true,
    },
  });

  sendSuccess(res, {
    message: "Requests for quotes fetched successfully",
    data: {
      results: rfquotes.length,
      data: rfquotes,
    },
  });
});

// For customer
export const getCustomerRFQs = catchAsync(async (req, res, next) => {
  const rfquotes = await prisma.requestForQuote.findMany({
    where: {
      customerId: req.body?.protectedObject?.customer?.id,
    },
    include: {
      pickupLocation: true,
      dropLocation: true,
      package: true,
    },
  });

  sendSuccess(res, {
    message: "Requests for quotes fetched successfully",
    data: {
      results: rfquotes.length,
      data: rfquotes,
    },
  });
});

// For driver
export const getAvailableRFQs = catchAsync(async (req, res, next) => {
  const rfquotes = await prisma.requestForQuote.findMany({
    where: {
      assignedDrivers: {
        some: {
          driverId: req.body?.protectedObject?.driver?.id,
        },
      },
    },
    include: {
      pickupLocation: true,
      dropLocation: true,
      package: true,
    },
  });

  sendSuccess(res, {
    message: "Requests for quotes fetched successfully",
    data: {
      results: rfquotes.length,
      data: rfquotes,
    },
  });
});

// For customer
export const getRequestForQuoteById = catchAsync(async (req, res, next) => {
  const rfquote = await prisma.requestForQuote.findFirstOrThrow({
    where: {
      id: req.params.id,
      customerId: req.body?.protectedObject?.customer?.id,
    },
    include: {
      pickupLocation: true,
      dropLocation: true,
      package: true,
    },
  });

  sendSuccess(res, {
    message: "Request for quote fetched successfully",
    data: {
      data: rfquote,
    },
  });
});

// For customer
export const updateRequestForQuote = catchAsync(async (req, res, next) => {
  const rfquote = await prisma.requestForQuote.findUnique({
    where: {
      id: req.params.id,
      customerId: req.body?.protectedObject?.customer?.id,
    },
  });

  if (!rfquote) {
    return next(new AppError("Request for Quote not found", 404));
  }

  let pickupLocationId = rfquote.pickupLocationId;
  if (req.body.pickupLatitude && req.body.pickupLongitude) {
    const pickupLocation = await prisma.location.upsert({
      where: {
        latitude_longitude: {
          latitude: req.body.pickupLatitude,
          longitude: req.body.pickupLongitude,
        },
      },
      create: {
        address: req.body.pickupAaddress,
        city: req.body.pickupCity,
        country: req.body.pickupCountry,
        state: req.body.pickupState,
        latitude: req.body.pickupLatitude,
        longitude: req.body.pickupLongitude,
      },
      update: {
        address: req.body.pickupAaddress,
        city: req.body.pickupCity,
        country: req.body.pickupCountry,
        state: req.body.pickupState,
      },
    });
    pickupLocationId = pickupLocation.id;
  }

  let dropLocationId = rfquote.dropLocationId;
  if (req.body.dropLatitude && req.body.dropLongitude) {
    const dropLocation = await prisma.location.upsert({
      where: {
        latitude_longitude: {
          latitude: req.body.dropLatitude,
          longitude: req.body.dropLongitude,
        },
      },
      create: {
        address: req.body.dropAaddress,
        city: req.body.dropCity,
        country: req.body.dropCountry,
        state: req.body.dropState,
        latitude: req.body.dropLatitude,
        longitude: req.body.dropLongitude,
      },
      update: {},
    });

    dropLocationId = dropLocation.id;
  }

  const updatedRFQ = await prisma.requestForQuote.update({
    where: { id: req.params.id },
    data: {
      pickupTime: req.body.pickupTime
        ? new Date(req.body.pickupTime)
        : rfquote.pickupTime,
      pickupDate: req.body.pickupDate
        ? new Date(req.body.pickupDate)
        : rfquote.pickupDate,
      dispatchMode: req.body.dispatchMode || rfquote.dispatchMode,
      pickupLocationId,
      dropLocationId,
      package: {
        upsert: req.body?.packages?.map((pkg: any) => ({
          where: {
            id: pkg?.id,
          },
          create: {
            description: pkg?.description,
            dimensions: pkg?.dimensions,
            fragile: pkg?.fragile,
            weight: pkg?.weight ? parseFloat(pkg?.weight) : 0,
            status: pkg?.status,
          },
          update: {
            description: pkg?.description,
            dimensions: pkg?.dimensions,
            fragile: pkg?.fragile,
            weight: pkg?.weight ? parseFloat(pkg?.weight) : undefined,
            status: pkg?.status,
          },
        })),
      },
    },
    include: {
      pickupLocation: true,
      dropLocation: true,
      package: true,
    },
  });

  sendSuccess(res, {
    message: "Request for quote updated successfully.",
    data: {
      data: updatedRFQ,
    },
  });
});

// For Admin
export const deleteRequestForQuote = catchAsync(async (req, res, next) => {});

// For customer
export const cancelRFQ = catchAsync(async (req, res, next) => {});

// For Driver
export const respondToInvitation = catchAsync(async (req, res, next) => {});

// For Admin
export const updateRFQStatus = catchAsync(async (req, res, next) => {});
