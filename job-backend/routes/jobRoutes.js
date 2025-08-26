const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('../controller/jobController');
const { protect } = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');
const upload = require('../middleware/upload'); 

// Public route to get all jobs
router.get('/', getJobs);

// Public route to get job by ID
router.get('/:id', getJobById);

// Admin-only route to post a job
router.post('/create', protect, checkAdmin, upload.single('logo'), createJob);
router.put('/update/:id',protect,checkAdmin,upload.single('logo'), updateJob)
router.delete('/delete/:id',protect,checkAdmin,deleteJob)

module.exports = router;
