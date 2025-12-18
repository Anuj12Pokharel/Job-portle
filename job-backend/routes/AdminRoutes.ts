import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  forgotPasswordAdmin,
  resetPasswordAdmin,
  getAllEmployers,
  getAllUsers,
  deleteUser,
  deleteEmployer,
  updateUserByAdmin,
  updateEmployerByAdmin,
  verifyEmployer
} from "../controller/AdminController";
import { protect } from "../middleware/authMiddleware";
import uploadProfile from "../middleware/uploadProfile";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPasswordAdmin);
router.post("/reset-password", resetPasswordAdmin);

router.get("/employers", protect, getAllEmployers);
router.get("/users", protect, getAllUsers);
router.delete("/user/:id", protect, deleteUser);
router.delete("/employer/:id", protect, deleteEmployer);
router.put("/user/:id", protect, uploadProfile.single("profilePicture"), updateUserByAdmin);
router.put("/employer/:id", protect, uploadProfile.single("profilePicture"), updateEmployerByAdmin);
router.put("/verify-employer/:id", protect, verifyEmployer);

export default router;
