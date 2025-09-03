import express from "express";
import { deleteUser, getUsers } from "../controllers/user-controller";

const router = express.Router();

router.route("/").get(getUsers);
router.route("/:id").delete(deleteUser);

export default router;
