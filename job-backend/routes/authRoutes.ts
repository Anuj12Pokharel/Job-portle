import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  sendLoginOtp, 
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
  updateProfile
} from "../controller/authController";
import { protect } from "../middleware/authMiddleware";
import { uploadProfile } from "../middleware/upload";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-otp/send", sendLoginOtp);
router.post("/login-otp/verify", verifyLoginOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/profile", protect, uploadProfile.single("profilePicture"), updateProfile);

export default router;
