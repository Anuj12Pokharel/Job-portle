const Job = require('../models/Job');

// @desc    Admin posts a new job
// @route   POST /api/jobs
// @access  Admin
const createJob = async (req, res) => {
  try {
    const adminId = req.user._id; // from protect + checkAdmin middleware
    const {
      companyName,
      position,
      category,
      location,
      jobLevel,
      salary,
      educationLevel,
      desiredCandidate,
      experience,
      expiryDate,
      description
    } = req.body;

    if (!companyName || !position) {
      return res.status(400).json({ message: "Company name and position are required" });
    }

    // Fix Windows file path issue
    const logo = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const job = new Job({
      companyName,
      logo,
      position,
      category,
      location,
      jobLevel,
      salary,
      educationLevel,
      desiredCandidate,
      experience,
      expiryDate,
      description,
      postedBy: adminId
    });

    await job.save();

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post job" });
  }
};

// @desc    Get all jobs for users
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'companyName email');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'companyName email');
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

module.exports = { createJob, getJobs, getJobById };
