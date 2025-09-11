import express from "express";
import {
  createDriver,
  deleteDriver,
  getDriver,
  getDrivers,
  updateDriver,
} from "../controllers/driver-controller";
import { protect } from "../controllers/auth-controller";

const router = express.Router();

router.use(protect);

router.route("/").get(getDrivers).post(createDriver);
router.route("/:id").get(getDriver).patch(updateDriver).delete(deleteDriver);

export default router;
