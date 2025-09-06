import express from "express";
import {
  forgotPassword,
  login,
  resetPasword,
  signUp,
} from "../controllers/auth-controller";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasword);

export default router;
