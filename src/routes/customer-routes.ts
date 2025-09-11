import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../controllers/customter-controller";
import { protect } from "../controllers/auth-controller";

const router = express.Router();

router.route("/").get(getCustomers).post(protect, createCustomer);

router
  .route("/:id")
  .get(getCustomer)
  .delete(protect, deleteCustomer)
  .patch(updateCustomer);

export default router;
