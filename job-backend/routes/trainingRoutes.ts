import express from "express";
import { getTrainings, createTraining } from "../controller/trainingController";

const router = express.Router();

router.get("/", getTrainings);
router.post("/", createTraining);

export default router;
