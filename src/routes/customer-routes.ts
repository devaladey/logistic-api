import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../controllers/customter-controller";

const router = express.Router();

router.route("/").get(getCustomers).post(createCustomer);

router
  .route("/:id")
  .get(getCustomer)
  .delete(deleteCustomer)
  .patch(updateCustomer);

export default router;
