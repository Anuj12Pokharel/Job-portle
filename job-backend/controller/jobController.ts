import { Request, Response } from "express";
import mongoose from "mongoose";
import Job from "../models/Job";
import Application from "../models/Application";
import Admin from "../models/Admin";
import User from "../models/User";

const ensureObjectId = (id: string) => new mongoose.Types.ObjectId(id);

export const createJob = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?._id || req.user?.id;
    if (!adminId) return res.status(401).json({ message: "Not authorized" });
    const adminObjectId = ensureObjectId(String(adminId));

    const jobData = { ...req.body, postedBy: adminObjectId } as any;
    if (req.file) jobData.logo = req.file.path.replace(/\\/g, "/");

    const job = new Job(jobData);
    await job.save();

    const admin = await Admin.findById(adminObjectId);
    if (admin) {
      admin.jobs.push(job._id as mongoose.Types.ObjectId);
      await admin.save();
    }

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post job" });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== String(req.user?._id || req.user?.id) && req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedData: any = { ...req.body };
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

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== String(req.user?._id || req.user?.id) && req.user?.role !== "superadmin")
      return res.status(403).json({ message: "Not authorized" });

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete job" });
  }
};

export const getApplicantsForJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== String(req.user?._id || req.user?.id) && req.user?.role !== "superadmin")
      return res.status(403).json({ message: "Not authorized" });

    const applicants = await Application.find({ job: job._id }).populate("user", "fullName email");
    res.json(applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};

export const getJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await Job.find().populate("postedBy", "companyName logo companyWebsite");
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
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

export const applyJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const jobId = req.params.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const exists = await Application.findOne({ user: userId, job: jobId });
    if (exists) return res.status(400).json({ message: "Already applied" });

    const application = new Application({
      user: ensureObjectId(String(userId)),
      job: ensureObjectId(jobId),
      coverLetter: (req.body as any).coverLetter,
      resume: req.file ? req.file.path : null,
    });

    await application.save();

    const user = await User.findById(userId);
    if (user) {
      user.appliedJobs.push(application._id as mongoose.Types.ObjectId);
      await user.save();
    }

    res.status(201).json({ message: "Applied successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to apply" });
  }
};

export const saveJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const jobId = req.params.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(userId);

    if (user && !user.savedJobs.map(String).includes(jobId)) {
      user.savedJobs.push(ensureObjectId(jobId));
      await user.save();
    }

    res.json({ message: "Job saved successfully", savedJobs: user?.savedJobs ?? [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save job" });
  }
};

export const getAppliedJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const applications = await Application.find({ user: userId }).populate("job");
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applied jobs" });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Job.aggregate([
      { $match: { category: { $exists: true, $ne: "" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);

    const formatted = categories.map((c) => ({
      name: c._id as string,
      count: c.count as number,
    }));

    console.log("getCategories result:", formatted);

    return res.status(200).json(formatted);
  } catch (err: any) {
    console.error("getCategories error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getMyJobs = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?._id || req.user?.id;
    if (!adminId) return res.status(401).json({ message: "Not authorized" });

    const jobs = await Job.find({ postedBy: adminId });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};
