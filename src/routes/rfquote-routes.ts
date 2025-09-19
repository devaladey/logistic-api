import express from "express";
import {
  cancelRFQ,
  createRequestForQuotes,
  deleteRequestForQuote,
  getAllRequestsForQuotes,
  getAvailableRFQs,
  getCustomerRFQs,
  getRequestForQuoteById,
  respondToInvitation,
  updateRFQStatus,
} from "../controllers/rfquote-controller";

const router = express.Router();

// These routes are for the customers
router.post("/", createRequestForQuotes);
router.get("/customer", getCustomerRFQs);
router.patch("/:id/cancel", cancelRFQ);
router.get("/:id", getRequestForQuoteById);

// These routes are for the admin
router.get("/admin/all", getAllRequestsForQuotes);
router.patch("/admin/:id/status", updateRFQStatus);
router.patch("/admin/:id", deleteRequestForQuote);

// These routes are for the drivers
router.get("/available", getAvailableRFQs);
router.patch("/:id/respond", respondToInvitation);

export default router;
