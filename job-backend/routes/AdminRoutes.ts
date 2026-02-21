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
  verifyEmployer,
  getEmployerProfile,
  updateEmployerProfile
} from "../controller/AdminController";
import { protect } from "../middleware/authMiddleware";
import uploadProfile from "../middleware/uploadProfile";

const router = Router();

// Debug logging for all admin routes
router.use((req, res, next) => {
  console.log("Admin Routes - Request to:", req.path, "Method:", req.method);
  console.log("Admin Routes - User role:", req.user?.role);
  console.log("Admin Routes - Full user object:", req.user);
  next();
});

// IMPORTANT: DO NOT ADD GLOBAL checkAdmin MIDDLEWARE HERE
// Employer profile routes should only use protect middleware

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPasswordAdmin);
router.post("/reset-password", resetPasswordAdmin);

// Employer Profile Routes (for employers to manage their own profiles)
// Note: These routes use only protect middleware, NOT checkAdmin, to allow employers to access their own profiles
router.get("/employer/profile", protect, getEmployerProfile);
router.put("/employer/profile", protect, uploadProfile.single("profilePicture"), updateEmployerProfile);

router.get("/employers", protect, getAllEmployers);
router.get("/users", protect, getAllUsers);
router.delete("/user/:id", protect, deleteUser);
router.delete("/employer/:id", protect, deleteEmployer);
router.put("/user/:id", protect, uploadProfile.single("profilePicture"), updateUserByAdmin);
router.put("/employer/:id", protect, uploadProfile.single("profilePicture"), updateEmployerByAdmin);
router.put("/verify-employer/:id", protect, verifyEmployer);

export default router;
