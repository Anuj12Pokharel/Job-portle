const Job = require('../models/Job');
const Application = require('../models/Application')
const Admin = require('../models/Admin')
const User = require('../models/User')
const mongoose = require("mongoose");



// @desc    Admin posts a new job
// @route   POST /api/jobs
// @access  Admin
const createJob = async (req, res) => {
  try {
    const adminId = req.user._id;

    const jobData = { ...req.body, postedBy: adminId };
    if (req.file) jobData.logo = req.file.path.replace(/\\/g, "/");

    const job = new Job(jobData);
    await job.save();

    // Add job to admin's jobs array
    const admin = await Admin.findById(adminId);
    admin.jobs.push(job._id);
    await admin.save();

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post job" });
  }
};





// Admin updates a job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prepare updated data
    const updatedData = { ...req.body };

    // If a new logo file is uploaded, replace the old one
    if (req.file) {
      updatedData.logo = req.file.path.replace(/\\/g, "/");
    }

    // Update the job with new data
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update job" });
  }
};

// Admin deletes a job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete job" });
  }
};
// Admin views applicants for a job
const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const applicants = await Application.find({ job: job._id }).populate("user", "fullName email");
    res.json(applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "companyName logo companyWebsite");
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};
// View single job detail
const getJobById = async (req, res) => {
  const {id} = req.params
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }
    const job = await Job.findById(id).populate("postedBy", "companyName logo companyWebsite");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};
// Apply for a job (user must be logged in)
const applyJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const exists = await Application.findOne({ user: userId, job: jobId });
    if (exists) return res.status(400).json({ message: "Already applied" });

    const application = new Application({
      user: userId,
      job: jobId,
      coverLetter: req.body.coverLetter,
      resume: req.file ? req.file.path : null
    });

    await application.save();

    const user = await User.findById(userId);
    user.appliedJobs.push(application._id);
    await user.save();

    res.status(201).json({ message: "Applied successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to apply" });
  }
};

// Save a job
const saveJob = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const jobId = req.params.id;
    
    const user = await User.findById(userId);

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.json({ message: "Job saved successfully", savedJobs: user.savedJobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save job" });
  }
};
// View user's applied jobs
const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).populate("job");
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applied jobs" });
  }
};
const getCategories = async (req, res) => {
  try {
    // filter out missing/empty categories, group and sort
    const categories = await Job.aggregate([
      { $match: { category: { $exists: true, $ne: "" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]);

    // Map to a nicer shape for the frontend
    const formatted = categories.map((c) => ({
      name: c._id,
      count: c.count
    }));

    // Debug log (remove in production if you want)
    console.log("getCategories result:", formatted);

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("getCategories error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports = { createJob,
  updateJob,
  deleteJob,
  getApplicantsForJob,
  getJobs,
  getJobById,
  applyJob,
  saveJob,
  getAppliedJobs,
  getCategories
 };
