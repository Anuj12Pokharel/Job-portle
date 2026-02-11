import express from "express";
import { protect } from "../middleware/authMiddleware";
import { checkJobseeker } from "../middleware/checkJobseeker";
import { getCVData, updateCVData, generateCV } from "../controller/cvController";

const router = express.Router();

router.use(protect);
router.use(checkJobseeker);

router.get("/profile", getCVData);
router.put("/profile", updateCVData);
router.post("/generate", generateCV);

export default router;
