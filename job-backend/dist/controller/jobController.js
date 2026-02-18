<<<<<<< HEAD
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobsByLevel = exports.updateApplicationStatus = exports.getMyJobs = exports.getCategories = exports.getAppliedJobs = exports.getSavedJobs = exports.saveJob = exports.applyJob = exports.getJobById = exports.getJobs = exports.getApplicantsForJob = exports.deleteJob = exports.updateJob = exports.createJob = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Job_1 = __importDefault(require("../models/Job"));
const Application_1 = __importDefault(require("../models/Application"));
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const historyService_1 = require("../services/historyService");
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
        console.log("createJob - Job saved with postedBy:", job.postedBy);
        const admin = await Admin_1.default.findById(adminObjectId);
        if (admin) {
            admin.jobs.push(job._id);
            await admin.save();
        }
        // Log history
        await (0, historyService_1.logHistory)("job", "created", job._id, job.toObject(), String(adminObjectId), req.user?.role || "admin", `Job created: ${job.position}`, adminObjectId);
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
        if (job.postedBy.toString() !== String(req.user?._id || req.user?.id) && req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Not authorized" });
        }
        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.logo = req.file.path.replace(/\\/g, "/");
        }
        const updatedJob = await Job_1.default.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        // Log history
        if (updatedJob) {
            await (0, historyService_1.logHistory)("job", "updated", updatedJob._id, updatedJob.toObject(), String(req.user?._id || req.user?.id), req.user?.role || "admin", `Job updated: ${updatedJob.position}`, updatedJob.postedBy);
        }
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
        if (job.postedBy.toString() !== String(req.user?._id || req.user?.id) && req.user?.role !== "superadmin")
            return res.status(403).json({ message: "Not authorized" });
        // Log history before deletion
        await (0, historyService_1.logHistory)("job", "deleted", job._id, job.toObject(), String(req.user?._id || req.user?.id), req.user?.role || "admin", `Job deleted: ${job.position}`, job.postedBy);
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
        if (job.postedBy.toString() !== String(req.user?._id || req.user?.id) && req.user?.role !== "superadmin")
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
const getJobs = async (req, res) => {
    try {
        const { category, search, featured } = req.query;
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (featured === "true") {
            filter.isFeatured = true;
        }
        if (search) {
            const searchRegex = new RegExp(String(search), "i");
            filter.$or = [
                { position: searchRegex },
                { location: searchRegex },
                { companyName: searchRegex },
                { description: searchRegex },
                { jobType: searchRegex },
            ];
        }
        const jobs = await Job_1.default.find(filter).populate("postedBy", "companyName logo companyWebsite");
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
            totalExperience: req.body.totalExperience,
            expectedSalary: req.body.expectedSalary,
            fieldOfExpertise: req.body.fieldOfExpertise,
            additionalInfo: req.body.additionalInfo,
            resume: req.file ? req.file.path : null,
        });
        await application.save();
        const user = await User_1.default.findById(userId);
        if (user) {
            user.appliedJobs.push(application._id);
            await user.save();
        }
        // Log history
        const job = await Job_1.default.findById(jobId);
        await (0, historyService_1.logHistory)("application", "applied", application._id, { ...application.toObject(), jobTitle: job?.position }, String(userId), req.user?.role || "user", `Applied for job: ${job?.position}`, job?.postedBy);
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
        if (user) {
            const savedIndex = user.savedJobs.map(String).indexOf(jobId);
            if (savedIndex !== -1) {
                user.savedJobs.splice(savedIndex, 1);
                await user.save();
                res.json({ message: "Job removed from saved", isSaved: false, savedJobs: user.savedJobs });
            }
            else {
                user.savedJobs.push(ensureObjectId(jobId));
                await user.save();
                res.json({ message: "Job saved successfully", isSaved: true, savedJobs: user.savedJobs });
            }
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to save job" });
    }
};
exports.saveJob = saveJob;
const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Not authorized" });
        const user = await User_1.default.findById(userId).populate({
            path: "savedJobs",
            populate: { path: "postedBy", select: "companyName logo" },
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user.savedJobs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch saved jobs" });
    }
};
exports.getSavedJobs = getSavedJobs;
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
            {
                $match: {
                    category: {
                        $exists: true,
                        $ne: "",
                        // Exclude known job levels that were mistakenly saved as categories
                        $nin: ["Junior", "Senior", "Middle Level", "Internship", "Entry Level"]
                    }
                }
            },
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
const getMyJobs = async (req, res) => {
    try {
        const adminId = req.user?._id || req.user?.id;
        console.log("getMyJobs - Admin ID:", adminId);
        if (!adminId)
            return res.status(401).json({ message: "Not authorized" });
        const jobs = await Job_1.default.find({ postedBy: adminId });
        console.log("getMyJobs - Found jobs:", jobs.length);
        res.json(jobs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
};
exports.getMyJobs = getMyJobs;
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const application = await Application_1.default.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        const job = await Job_1.default.findById(application.job);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        // Authorization check: Only the job poster (admin) can update status
        const userId = req.user?._id || req.user?.id;
        if (job.postedBy.toString() !== String(userId) && req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Not authorized to update this application" });
        }
        if (!["applied", "viewing", "hiring-process", "hired", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        application.status = status;
        await application.save();
        // Log history for status changes (hired/rejected are most important)
        const user = await User_1.default.findById(application.user);
        if (status === "hired" || status === "rejected") {
            await (0, historyService_1.logHistory)("application", status === "hired" ? "accepted" : "rejected", application._id, { ...application.toObject(), jobTitle: job.position, userName: user?.fullName }, String(userId), req.user?.role || "admin", `Application ${status}: ${user?.fullName} for ${job.position}`, job.postedBy);
        }
        res.json({ message: "Status updated successfully", application });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update status" });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const getJobsByLevel = async (req, res) => {
    try {
        let { level } = req.query;
        if (!level)
            return res.status(400).json({ message: "Job level is required" });
        // Trim and remove extra spaces/newlines
        level = String(level).trim();
        const jobs = await Job_1.default.find({ jobLevel: level })
            .sort({ createdAt: -1 })
            .select("companyName logo position jobLevel")
            .limit(10);
        res.status(200).json(jobs);
    }
    catch (err) {
        console.error("getJobsByLevel error:", err);
        res.status(500).json({ message: "Failed to fetch jobs by level" });
    }
};
exports.getJobsByLevel = getJobsByLevel;
=======
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobsByLevel = exports.updateApplicationStatus = exports.getMyJobs = exports.getCategories = exports.getAppliedJobs = exports.getSavedJobs = exports.saveJob = exports.applyJob = exports.getJobById = exports.getJobs = exports.getApplicantsForJob = exports.deleteJob = exports.updateJob = exports.createJob = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Job_1 = __importDefault(require("../models/Job"));
const Application_1 = __importDefault(require("../models/Application"));
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const historyService_1 = require("../services/historyService");
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
        console.log("createJob - Job saved with postedBy:", job.postedBy);
        const admin = await Admin_1.default.findById(adminObjectId);
        if (admin) {
            admin.jobs.push(job._id);
            await admin.save();
        }
        // Log history
        await (0, historyService_1.logHistory)("job", "created", job._id, job.toObject(), String(adminObjectId), req.user?.role || "admin", `Job created: ${job.position}`, adminObjectId);
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
        if (job.postedBy.toString() !== String(req.user?._id || req.user?.id) && req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Not authorized" });
        }
        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.logo = req.file.path.replace(/\\/g, "/");
        }
        const updatedJob = await Job_1.default.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        // Log history
        if (updatedJob) {
            await (0, historyService_1.logHistory)("job", "updated", updatedJob._id, updatedJob.toObject(), String(req.user?._id || req.user?.id), req.user?.role || "admin", `Job updated: ${updatedJob.position}`, updatedJob.postedBy);
        }
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
        if (job.postedBy.toString() !== String(req.user?._id || req.user?.id) && req.user?.role !== "superadmin")
            return res.status(403).json({ message: "Not authorized" });
        // Log history before deletion
        await (0, historyService_1.logHistory)("job", "deleted", job._id, job.toObject(), String(req.user?._id || req.user?.id), req.user?.role || "admin", `Job deleted: ${job.position}`, job.postedBy);
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
        if (job.postedBy.toString() !== String(req.user?._id || req.user?.id) && req.user?.role !== "superadmin")
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
const getJobs = async (req, res) => {
    try {
        const { category, search, featured } = req.query;
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (featured === "true") {
            filter.isFeatured = true;
        }
        if (search) {
            const searchRegex = new RegExp(String(search), "i");
            filter.$or = [
                { position: searchRegex },
                { location: searchRegex },
                { companyName: searchRegex },
                { description: searchRegex },
                { jobType: searchRegex },
            ];
        }
        const jobs = await Job_1.default.find(filter).populate("postedBy", "companyName logo companyWebsite");
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
            totalExperience: req.body.totalExperience,
            expectedSalary: req.body.expectedSalary,
            fieldOfExpertise: req.body.fieldOfExpertise,
            additionalInfo: req.body.additionalInfo,
            resume: req.file ? req.file.path : null,
        });
        await application.save();
        const user = await User_1.default.findById(userId);
        if (user) {
            user.appliedJobs.push(application._id);
            await user.save();
        }
        // Log history
        const job = await Job_1.default.findById(jobId);
        await (0, historyService_1.logHistory)("application", "applied", application._id, { ...application.toObject(), jobTitle: job?.position }, String(userId), req.user?.role || "user", `Applied for job: ${job?.position}`, job?.postedBy);
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
        if (user) {
            const savedIndex = user.savedJobs.map(String).indexOf(jobId);
            if (savedIndex !== -1) {
                user.savedJobs.splice(savedIndex, 1);
                await user.save();
                res.json({ message: "Job removed from saved", isSaved: false, savedJobs: user.savedJobs });
            }
            else {
                user.savedJobs.push(ensureObjectId(jobId));
                await user.save();
                res.json({ message: "Job saved successfully", isSaved: true, savedJobs: user.savedJobs });
            }
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to save job" });
    }
};
exports.saveJob = saveJob;
const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Not authorized" });
        const user = await User_1.default.findById(userId).populate({
            path: "savedJobs",
            populate: { path: "postedBy", select: "companyName logo" },
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user.savedJobs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch saved jobs" });
    }
};
exports.getSavedJobs = getSavedJobs;
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
            {
                $match: {
                    category: {
                        $exists: true,
                        $ne: "",
                        // Exclude known job levels that were mistakenly saved as categories
                        $nin: ["Junior", "Senior", "Middle Level", "Internship", "Entry Level"]
                    }
                }
            },
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
const getMyJobs = async (req, res) => {
    try {
        const adminId = req.user?._id || req.user?.id;
        console.log("getMyJobs - Admin ID:", adminId);
        if (!adminId)
            return res.status(401).json({ message: "Not authorized" });
        const jobs = await Job_1.default.find({ postedBy: adminId });
        console.log("getMyJobs - Found jobs:", jobs.length);
        res.json(jobs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
};
exports.getMyJobs = getMyJobs;
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const application = await Application_1.default.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        const job = await Job_1.default.findById(application.job);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        // Authorization check: Only the job poster (admin) can update status
        const userId = req.user?._id || req.user?.id;
        if (job.postedBy.toString() !== String(userId) && req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Not authorized to update this application" });
        }
        if (!["applied", "viewing", "hiring-process", "hired", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        application.status = status;
        await application.save();
        // Log history for status changes (hired/rejected are most important)
        const user = await User_1.default.findById(application.user);
        if (status === "hired" || status === "rejected") {
            await (0, historyService_1.logHistory)("application", status === "hired" ? "accepted" : "rejected", application._id, { ...application.toObject(), jobTitle: job.position, userName: user?.fullName }, String(userId), req.user?.role || "admin", `Application ${status}: ${user?.fullName} for ${job.position}`, job.postedBy);
        }
        res.json({ message: "Status updated successfully", application });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update status" });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const getJobsByLevel = async (req, res) => {
    try {
        let { level } = req.query;
        if (!level)
            return res.status(400).json({ message: "Job level is required" });
        // Trim and remove extra spaces/newlines
        level = String(level).trim();
        const jobs = await Job_1.default.find({ jobLevel: level })
            .sort({ createdAt: -1 })
            .select("companyName logo position jobLevel")
            .limit(10);
        res.status(200).json(jobs);
    }
    catch (err) {
        console.error("getJobsByLevel error:", err);
        res.status(500).json({ message: "Failed to fetch jobs by level" });
    }
};
exports.getJobsByLevel = getJobsByLevel;
>>>>>>> origin/updated-feature
