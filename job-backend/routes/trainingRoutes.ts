import express from "express";
import { getTrainings, createTraining,updateTraining,deleteTraining } from "../controller/trainingController";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";
import uploadTraining from "../middleware/uploadTraining";

const router = express.Router();

router.get("/", getTrainings);
router.post("/", protect, checkAdmin, uploadTraining.single("image"), createTraining);
router.put("/update/:id", protect, checkAdmin, uploadTraining.single("image"), updateTraining);
router.delete("/delete/:id", protect, checkAdmin, deleteTraining);

export default router;
