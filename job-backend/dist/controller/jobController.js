"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.getAppliedJobs = exports.saveJob = exports.applyJob = exports.getJobById = exports.getJobs = exports.getApplicantsForJob = exports.deleteJob = exports.updateJob = exports.createJob = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Job_1 = __importDefault(require("../models/Job"));
const Application_1 = __importDefault(require("../models/Application"));
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const ensureObjectId = (id) => new mongoose_1.default.Types.ObjectId(id);
const createJob = async (req, res) => {
    try {
        const adminId = req.user?._id || req.user?.id;
        if (!adminId)
            return res.status(401).json({ message: "Not authorized" });
        const adminObjectId = ensureObjectId(String(adminId));
        const jobData = { ...req.body, postedBy: adminObjectId };
        if (req.file)
            jobData.logo = req.file.path.replace(/\\/g, "/");
        const job = new Job_1.default(jobData);
        await job.save();
        const admin = await Admin_1.default.findById(adminObjectId);
        if (admin) {
            admin.jobs.push(job._id);
            await admin.save();
        }
        res.status(201).json({ message: "Job posted successfully", job });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to post job" });
    }
};
exports.createJob = createJob;
const updateJob = async (req, res) => {
    try {
        const job = await Job_1.default.findById(req.params.id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        if (job.postedBy.toString() !== String(req.user?._id || req.user?.id)) {
            return res.status(403).json({ message: "Not authorized" });
        }
        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.logo = req.file.path.replace(/\\/g, "/");
        }
        const updatedJob = await Job_1.default.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json({ message: "Job updated successfully", job: updatedJob });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update job" });
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res) => {
    try {
        const job = await Job_1.default.findById(req.params.id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        if (job.postedBy.toString() !== String(req.user?._id || req.user?.id))
            return res.status(403).json({ message: "Not authorized" });
        await job.deleteOne();
        res.json({ message: "Job deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete job" });
    }
};
exports.deleteJob = deleteJob;
const getApplicantsForJob = async (req, res) => {
    try {
        const job = await Job_1.default.findById(req.params.id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        if (job.postedBy.toString() !== String(req.user?._id || req.user?.id))
            return res.status(403).json({ message: "Not authorized" });
        const applicants = await Application_1.default.find({ job: job._id }).populate("user", "fullName email");
        res.json(applicants);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch applicants" });
    }
};
exports.getApplicantsForJob = getApplicantsForJob;
const getJobs = async (_req, res) => {
    try {
        const jobs = await Job_1.default.find().populate("postedBy", "companyName logo companyWebsite");
        res.json(jobs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
};
exports.getJobs = getJobs;
const getJobById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }
        const job = await Job_1.default.findById(id).populate("postedBy", "companyName logo companyWebsite");
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        res.json(job);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch job" });
    }
};
exports.getJobById = getJobById;
const applyJob = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const jobId = req.params.id;
        if (!userId)
            return res.status(401).json({ message: "Not authorized" });
        const exists = await Application_1.default.findOne({ user: userId, job: jobId });
        if (exists)
            return res.status(400).json({ message: "Already applied" });
        const application = new Application_1.default({
            user: ensureObjectId(String(userId)),
            job: ensureObjectId(jobId),
            coverLetter: req.body.coverLetter,
            resume: req.file ? req.file.path : null,
        });
        await application.save();
        const user = await User_1.default.findById(userId);
        if (user) {
            user.appliedJobs.push(application._id);
            await user.save();
        }
        res.status(201).json({ message: "Applied successfully", application });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to apply" });
    }
};
exports.applyJob = applyJob;
const saveJob = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const jobId = req.params.id;
        if (!userId)
            return res.status(401).json({ message: "Not authorized" });
        const user = await User_1.default.findById(userId);
        if (user && !user.savedJobs.map(String).includes(jobId)) {
            user.savedJobs.push(ensureObjectId(jobId));
            await user.save();
        }
        res.json({ message: "Job saved successfully", savedJobs: user?.savedJobs ?? [] });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to save job" });
    }
};
exports.saveJob = saveJob;
const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Not authorized" });
        const applications = await Application_1.default.find({ user: userId }).populate("job");
        res.json(applications);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch applied jobs" });
    }
};
exports.getAppliedJobs = getAppliedJobs;
const getCategories = async (_req, res) => {
    try {
        const categories = await Job_1.default.aggregate([
            { $match: { category: { $exists: true, $ne: "" } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
        ]);
        const formatted = categories.map((c) => ({
            name: c._id,
            count: c.count,
        }));
        console.log("getCategories result:", formatted);
        return res.status(200).json(formatted);
    }
    catch (err) {
        console.error("getCategories error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.getCategories = getCategories;
