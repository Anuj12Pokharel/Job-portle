import express from "express";
import { getStatistics, getTrainingStatistics, updateStatistics } from "../controller/statisticsController";
import { protect, checkSuperAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getStatistics);
router.get("/training", getTrainingStatistics);
router.put("/", protect, checkSuperAdmin, updateStatistics);

export default router;
