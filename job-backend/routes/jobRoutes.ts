import { Router } from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getApplicantsForJob,
  getJobs,
  getJobById,
  applyJob,
  saveJob,
  getAppliedJobs,
  getSavedJobs,
  getCategories,
  getMyJobs,
  updateApplicationStatus,
  getJobsByLevel,
} from "../controller/jobController";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";
import upload from "../middleware/upload";

const router = Router();

// Specific routes first to avoid catching by :id
router.get("/myjobs", protect, checkAdmin, getMyJobs);
router.get("/get", getJobs);
router.get("/categories", getCategories);
router.get("/by-level", getJobsByLevel);
router.get("/:id", getJobById);

router.post("/apply/:id", protect, upload.single("resume"), applyJob);
router.post("/save/:id", protect, saveJob);
router.get("/user/applied", protect, getAppliedJobs);
router.get("/user/saved", protect, getSavedJobs);

router.post("/create", protect, checkAdmin, upload.single("logo"), createJob);
router.put("/update/:id", protect, checkAdmin, upload.single("logo"), updateJob);
router.delete("/delete/:id", protect, checkAdmin, deleteJob);

router.get("/:id/applicants", protect, checkAdmin, getApplicantsForJob);
router.put("/application/:id/status", protect, checkAdmin, updateApplicationStatus);



export default router;
