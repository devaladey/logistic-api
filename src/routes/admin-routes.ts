import express from "express";
import {
  createAdmin,
 deleteAdmin,
 getAdmin,
 getAdmins,
 updateAdmin,
} from "../controllers/admin-controller";

const router = express.Router();

router.route("/").get(getAdmins).post(createAdmin);

router
  .route("/:id")
  .get(getAdmin)
  .delete(deleteAdmin)
  .patch(updateAdmin);

export default router;
