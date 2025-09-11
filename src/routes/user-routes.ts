import express from "express";
import { deleteUser, getUsers } from "../controllers/user-controller";
import { protect, restrictTo } from "../controllers/auth-controller";
import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controllers/profile-controller";
import { permissionsObject } from "../constants/permissions";

const router = express.Router();

router.use(protect);

router.route("/").get(
  restrictTo(permissionsObject.customer_profile_view), 
  getUsers);

router
  .route("/:id/profile")
  .get(getProfile)
  .post(createProfile)
  .patch(updateProfile)
  .delete(deleteProfile);

// router.route("/").get(getUsers);

router.route("/:id").delete(deleteUser);

export default router;
