import express from "express";
import { getStatistics, getTrainingStatistics } from "../controller/statisticsController";

const router = express.Router();

router.get("/", getStatistics);
router.get("/training", getTrainingStatistics);

export default router;
