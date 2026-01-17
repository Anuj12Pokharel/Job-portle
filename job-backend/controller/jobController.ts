import { Request, Response } from "express";
import mongoose from "mongoose";
import Job from "../models/Job";
import Application from "../models/Application";
import Admin from "../models/Admin";
import User from "../models/User";
import { logHistory } from "../services/historyService";

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
    console.log("createJob - Job saved with postedBy:", job.postedBy);

    const admin = await Admin.findById(adminObjectId);
    if (admin) {
      admin.jobs.push(job._id as mongoose.Types.ObjectId);
      await admin.save();
    }

    // Log history
    // Log history
    await logHistory("job", "created", job._id, job.toObject(), adminObjectId, req.user?.role || "admin", adminObjectId, `Job created: ${job.position}`);

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

    // Log history
    if (updatedJob) {
      await logHistory("job", "updated", updatedJob._id, updatedJob.toObject(), req.user?._id || req.user?.id, req.user?.role || "admin", updatedJob.postedBy, `Job updated: ${updatedJob.position}`);
    }

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

    // Log history before deletion
    await logHistory("job", "deleted", job._id, job.toObject(), req.user?._id || req.user?.id, req.user?.role || "admin", job.postedBy, `Job deleted: ${job.position}`);

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

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = category;
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

    const jobs = await Job.find(filter).populate(
      "postedBy",
      "companyName logo companyWebsite"
    );
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
      totalExperience: (req.body as any).totalExperience,
      expectedSalary: (req.body as any).expectedSalary,
      fieldOfExpertise: (req.body as any).fieldOfExpertise,
      additionalInfo: (req.body as any).additionalInfo,
      resume: req.file ? req.file.path : null,
    });

    await application.save();

    const user = await User.findById(userId);
    if (user) {
      user.appliedJobs.push(application._id as mongoose.Types.ObjectId);
      await user.save();
    }

    // Log history
    const job = await Job.findById(jobId);
    await logHistory("application", "applied", application._id, { ...application.toObject(), jobTitle: job?.position }, userId, req.user?.role || "user", job?.postedBy, `Applied for job: ${job?.position}`);

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

    if (user) {
      const savedIndex = user.savedJobs.map(String).indexOf(jobId);
      if (savedIndex !== -1) {
        user.savedJobs.splice(savedIndex, 1);
        await user.save();
        res.json({ message: "Job removed from saved", isSaved: false, savedJobs: user.savedJobs });
      } else {
        user.savedJobs.push(ensureObjectId(jobId));
        await user.save();
        res.json({ message: "Job saved successfully", isSaved: true, savedJobs: user.savedJobs });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save job" });
  }
};

export const getSavedJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(userId).populate({
      path: "savedJobs",
      populate: { path: "postedBy", select: "companyName logo" },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch saved jobs" });
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
    console.log("getMyJobs - Admin ID:", adminId);
    if (!adminId) return res.status(401).json({ message: "Not authorized" });

    const jobs = await Job.find({ postedBy: adminId });
    console.log("getMyJobs - Found jobs:", jobs.length);
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.job);
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
    const user = await User.findById(application.user);
    if (status === "hired" || status === "rejected") {
      await logHistory("application", status === "hired" ? "accepted" : "rejected", application._id, { ...application.toObject(), jobTitle: job.position, userName: user?.fullName }, userId, req.user?.role || "admin", job.postedBy, `Application ${status}: ${user?.fullName} for ${job.position}`);
    }

    res.json({ message: "Status updated successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
