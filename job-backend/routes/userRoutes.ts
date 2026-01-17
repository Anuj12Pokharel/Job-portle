import { Router } from "express";
import { getProfile, updateProfile } from "../controller/userController";
import { protect } from "../middleware/authMiddleware";
import uploadProfile from "../middleware/uploadProfile";

const router = Router();

router.get("/profile", protect, getProfile);
router.put(
    "/profile",
    protect,
    uploadProfile.single("profilePicture"),
    updateProfile
);

export default router;
