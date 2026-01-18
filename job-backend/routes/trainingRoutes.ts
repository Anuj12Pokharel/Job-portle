import express from "express";
import { getTrainings, createTraining,updateTraining,deleteTraining } from "../controller/trainingController";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";

const router = express.Router();

router.get("/", getTrainings);
router.post("/", protect, checkAdmin, createTraining);
router.put("/update/:id", protect, checkAdmin, updateTraining);
router.delete("/delete/:id", protect, checkAdmin, deleteTraining);

export default router;
