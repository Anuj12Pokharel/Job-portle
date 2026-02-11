import express from "express";
import {
    createEnrollment,
    getEnrollments,
    updateEnrollmentStatus,
    deleteEnrollment
} from "../controller/enrollmentController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public route - anyone can enroll
router.post("/", createEnrollment);

// Protected routes - requires authentication
router.get("/", protect, getEnrollments);
router.put("/:id", protect, updateEnrollmentStatus);
router.delete("/:id", protect, deleteEnrollment);

export default router;
