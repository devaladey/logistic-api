import express from "express";
import {
  createDriver,
  deleteDriver,
  getDriver,
  getDrivers,
  updateDriver,
} from "../controllers/driver-controller";

const router = express.Router();

router.route("/").get(getDrivers).post(createDriver);
router.route("/:id").get(getDriver).patch(updateDriver).delete(deleteDriver);

export default router;
