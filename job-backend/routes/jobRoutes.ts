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
  getAppliedJobs,
  getCategories,
  getMyJobs,
} from "../controller/jobController";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";
import upload from "../middleware/upload";

const router = Router();

router.get("/get", getJobs);
router.get("/categories", getCategories);
router.get("/:id", getJobById);

router.post("/apply/:id", protect, upload.single("resume"), applyJob);
router.post("/save/:id", protect, saveJob);
router.get("/user/applied", protect, getAppliedJobs);

router.post("/create", protect, checkAdmin, upload.single("logo"), createJob);
router.put("/update/:id", protect, checkAdmin, upload.single("logo"), updateJob);
router.delete("/delete/:id", protect, checkAdmin, deleteJob);
router.get("/myjobs", protect, checkAdmin, getMyJobs);
router.get("/:id/applicants", protect, checkAdmin, getApplicantsForJob);

export default router;
