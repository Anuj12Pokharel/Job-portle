import express from "express";
import { addLogo, getLogos, deleteLogo } from "../controller/clientLogoController";
import uploadLogo from "../middleware/uploadLogo";
import checkAdmin from "../middleware/checkAdmin";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public route to get logos
router.get("/get", getLogos);

// Protected routes
router.post("/add", protect, checkAdmin, uploadLogo.single("logo"), addLogo);
router.delete("/delete/:id", protect, checkAdmin, deleteLogo);

export default router;
