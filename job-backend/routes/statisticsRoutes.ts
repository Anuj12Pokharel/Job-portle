import express from "express";
import { getStatistics } from "../controller/statisticsController";

const router = express.Router();

router.get("/", getStatistics);

export default router;
