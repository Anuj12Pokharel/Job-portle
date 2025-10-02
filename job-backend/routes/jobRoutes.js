const express = require('express');
const router = express.Router();
const {
  createJob,
  updateJob,
  deleteJob,
  getApplicantsForJob,
  getJobs,
  getJobById,
  applyJob,
  saveJob,
  getAppliedJobs,
  getCategories
} = require('../controller/jobController');

const { protect } = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');
const upload = require('../middleware/upload');

// -------------------- Public Routes --------------------

// Get all jobs
router.get('/get', getJobs);
router.get("/categories", getCategories);

// Get single job by ID
router.get('/:id', getJobById);

// -------------------- User Routes --------------------

// Apply for a job
router.post('/apply/:id', protect, upload.single('resume'), applyJob);

// Save a job
router.post('/save/:id', protect, saveJob);

// View user’s applied jobs
router.get('/user/applied', protect, getAppliedJobs);

// -------------------- Admin Routes --------------------

// Create a new job
router.post('/create', protect, checkAdmin, upload.single('logo'), createJob);

// Update a job
router.put('/update/:id', protect, checkAdmin, upload.single('logo'), updateJob);

// Delete a job
router.delete('/delete/:id', protect, checkAdmin, deleteJob);

// Get applicants for a specific job
router.get('/:id/applicants', protect, checkAdmin, getApplicantsForJob);


module.exports = router;
