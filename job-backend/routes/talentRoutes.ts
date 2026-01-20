import express from "express";
import { submitTalent, getTalents } from "../controller/talentController";
import uploadCV from "../middleware/uploadCV";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";

const router = express.Router();

// Public: submit application
router.post("/submit", uploadCV.single("cv"), submitTalent);

// SuperAdmin: get all submissions
router.get("/all", protect, checkAdmin, getTalents);

export default router;
