"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controller/jobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkAdmin_1 = __importDefault(require("../middleware/checkAdmin"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = (0, express_1.Router)();
// Specific routes first to avoid catching by :id
router.get("/myjobs", authMiddleware_1.protect, checkAdmin_1.default, jobController_1.getMyJobs);
router.get("/get", jobController_1.getJobs);
router.get("/categories", jobController_1.getCategories);
router.get("/by-level", jobController_1.getJobsByLevel);
router.get("/:id", jobController_1.getJobById);
router.post("/apply/:id", authMiddleware_1.protect, upload_1.default.single("resume"), jobController_1.applyJob);
router.post("/save/:id", authMiddleware_1.protect, jobController_1.saveJob);
router.get("/user/applied", authMiddleware_1.protect, jobController_1.getAppliedJobs);
router.get("/user/saved", authMiddleware_1.protect, jobController_1.getSavedJobs);
router.post("/create", authMiddleware_1.protect, checkAdmin_1.default, upload_1.default.single("logo"), jobController_1.createJob);
router.put("/update/:id", authMiddleware_1.protect, checkAdmin_1.default, upload_1.default.single("logo"), jobController_1.updateJob);
router.delete("/delete/:id", authMiddleware_1.protect, checkAdmin_1.default, jobController_1.deleteJob);
router.get("/:id/applicants", authMiddleware_1.protect, checkAdmin_1.default, jobController_1.getApplicantsForJob);
router.put("/application/:id/status", authMiddleware_1.protect, checkAdmin_1.default, jobController_1.updateApplicationStatus);
exports.default = router;
