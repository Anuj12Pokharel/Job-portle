import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  sendLoginOtp, 
  verifyLoginOtp,
  forgotPassword,
  resetPassword
} from "../controller/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-otp/send", sendLoginOtp);
router.post("/login-otp/verify", verifyLoginOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
