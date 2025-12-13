import { Router } from "express";
import {
  registerUser,
  loginUser,
  sendLoginOtp,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
} from "../controller/authController";
import { googleSignIn } from "../controller/googleAuthController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-otp/send", sendLoginOtp);
router.post("/login-otp/verify", verifyLoginOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/google", googleSignIn);

export default router;
