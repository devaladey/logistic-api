import express from "express";
import { deleteUser, getUsers } from "../controllers/user-controller";
import { protect } from "../controllers/auth-controller";
import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controllers/profile-controller";

const router = express.Router();

router.use(protect);

router.route("/").get(getUsers);

router
  .route("/:id/profile")
  .get(getProfile)
  .post(createProfile)
  .patch(updateProfile)
  .delete(deleteProfile);

// router.route("/").get(getUsers);

router.route("/:id").delete(deleteUser);

export default router;
