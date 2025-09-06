import express from "express";
import { deleteUser, getUsers } from "../controllers/user-controller";
import { protect } from "../controllers/auth-controller";

const router = express.Router();

router.use(protect);

router.route("/").get(getUsers);
router.route("/:id").delete(deleteUser);

export default router;
