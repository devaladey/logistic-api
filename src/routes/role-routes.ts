import express from "express";
import {
  assignPermissionToRole,
  createRole,
  getRoles,
  unAssignPermissionToRole,
} from "../controllers/role-controller";

const router = express.Router();

router.route("/").get(getRoles).post(createRole);

router
  .route("/:id/permission")
  .post(assignPermissionToRole)
  .delete(unAssignPermissionToRole);

export default router;
