import express from "express";
import {
  createAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
  updateAdmin,
} from "../controllers/admin-controller";
import { protect } from "../controllers/auth-controller";

const router = express.Router();

router.use(protect);

router.route("/").get(getAdmins).post(createAdmin);

router.route("/:id").get(getAdmin).delete(deleteAdmin).patch(updateAdmin);

export default router;
