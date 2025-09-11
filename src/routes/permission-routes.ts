import express from "express";
import {
  createPermission,
  deletePermission,
  getPermission,
  getPermissions,
  updatePermission,
} from "../controllers/permisssion-controller";

const router = express.Router();

router.route("/").get(getPermissions).post(createPermission);

router
  .route("/:id")
  .get(getPermission)
  .patch(updatePermission)
  .delete(deletePermission);

export default router;
