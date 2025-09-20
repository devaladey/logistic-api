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
  updateRequestForQuote,
  updateRFQStatus,
} from "../controllers/rfquote-controller";
import { protect } from "../controllers/auth-controller";

const router = express.Router();



// These routes are for the customers
router.post("/customer", protect, createRequestForQuotes);
router.get("/customer", getCustomerRFQs);
router.patch("/customer/:id/customer_cancel", cancelRFQ);
router.get("/customer/:id", protect, getRequestForQuoteById);
router.patch("/customer/:id", protect, updateRequestForQuote);

// These routes are for the admin
router.get("/admin/all", getAllRequestsForQuotes);
router.patch("/admin/:id/status", updateRFQStatus);
router.patch("/admin/:id", deleteRequestForQuote);

// These routes are for the drivers
router.get("/driver/available", getAvailableRFQs);
router.patch("driver/:id/respond", respondToInvitation);

export default router;
