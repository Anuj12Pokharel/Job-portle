const Job = require('../models/Job');

// @desc    Post a new job (admin only)
const postJob = async (req, res) => {
  try {
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

    const logo = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const job = await Job.create({
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
      postedBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Server error while posting job' });
  }
};

// @desc    Get all jobs (for users)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'fullName email');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

// @desc    Get single job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'fullName email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error while fetching job' });
  }
};

module.exports = { postJob, getAllJobs, getJobById };
