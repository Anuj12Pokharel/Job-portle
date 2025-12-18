import express from "express";
import { getTrainings } from "../controller/trainingController";

const router = express.Router();

router.get("/", getTrainings);

export default router;
