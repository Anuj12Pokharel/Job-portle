const Job = require('../models/Job');

// @desc    Admin posts a new job
// @route   POST /api/jobs
// @access  Admin
const createJob = async (req, res) => {
  try {
    const adminId = req.user._id; 
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
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    // check ownership
    if (job.postedBy.toString() !== req.user._id.toString()) {
       console.log("Job postedBy:", job.postedBy.toString());
  console.log("User id:", req.user._id.toString());
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updatedData = { ...req.body };

    // handle logo update if file uploaded
    if (req.file) {
      updatedData.logo = req.file.path.replace(/\\/g, "/");
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update job" });
  }
};
// @desc    Delete a job (only admin who posted it)
// @route   DELETE /api/jobs/:id
// @access  Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    // check ownership
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete job" });
  }
};


module.exports = { createJob, getJobs, getJobById,updateJob, deleteJob };
