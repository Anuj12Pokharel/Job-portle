import { Request, Response } from "express";
import mongoose from "mongoose";
import Job from "../models/Job";
import Application from "../models/Application";
import Admin from "../models/Admin";
import User from "../models/User";
import { logHistory } from "../services/historyService";

type ObjectId = mongoose.Types.ObjectId;


const ensureObjectId = (id: string) => new mongoose.Types.ObjectId(id);

export const createJob = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?._id || req.user?.id;
    if (!adminId) return res.status(401).json({ message: "Not authorized" });
    const adminObjectId = ensureObjectId(String(adminId));

    const jobData = { ...req.body, postedBy: adminObjectId } as any;
    if (req.file) {
      jobData.logo = req.file.path.replace(/\\/g, "/");
    } else if (jobData.logo === "undefined" || jobData.logo === "null") {
      delete jobData.logo;
    }

    // Remove empty string values for optional enum fields to prevent validation errors
    const optionalFields = ["jobLevel", "jobType", "salary", "educationLevel", "desiredCandidate",
      "experience", "description", "noOfOpenings", "industry", "vehicleLicense", "twoFourWheeler",
      "skills", "aboutCompany", "companyWebsite", "expiryDate"];
    for (const field of optionalFields) {
      if (jobData[field] === "" || jobData[field] === undefined) {
        delete jobData[field];
      }
    }

    const job = new Job(jobData);
    await job.save();
    console.log("createJob - Job saved with postedBy:", job.postedBy);

    const admin = await Admin.findById(adminObjectId);
    if (admin) {
      admin.jobs.push(job._id as mongoose.Types.ObjectId);
      await admin.save();
    }

    // Log history
    await logHistory("job", "created", job._id as unknown as string | ObjectId, job.toObject(), String(adminObjectId), req.user?.role || "admin", `Job created: ${job.position}`, adminObjectId as unknown as string | ObjectId);

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err: any) {
    console.error(err);
    const message = err.name === "ValidationError"
      ? `Validation error: ${Object.values(err.errors).map((e: any) => e.message).join(", ")}`
      : "Failed to post job";
    res.status(500).json({ message });
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
    } else if (updatedData.logo === "undefined" || updatedData.logo === "null") {
      delete updatedData.logo;
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    // Log history
    if (updatedJob) {
      await logHistory("job", "updated", updatedJob._id as unknown as string | ObjectId, updatedJob.toObject(), String(req.user?._id || req.user?.id), req.user?.role || "admin", `Job updated: ${updatedJob.position}`, updatedJob.postedBy as unknown as string | ObjectId);
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
    await logHistory("job", "deleted", job._id as unknown as string | ObjectId, job.toObject(), String(req.user?._id || req.user?.id), req.user?.role || "admin", `Job deleted: ${job.position}`, job.postedBy as unknown as string | ObjectId);

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
    const { category, search, location, featured } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = new RegExp(`^${String(category).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (location) {
      filter.location = new RegExp(String(location), "i");
    }

    if (search) {
      const searchRegex = new RegExp(String(search), "i");
      filter.$or = [
        { position: searchRegex },
        { companyName: searchRegex },
        { description: searchRegex },
        { jobType: searchRegex },
        { skills: searchRegex },
      ];
    }

    // Hide expired jobs from jobseekers
    filter.$or = filter.$or || [];
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: new Date() } }
      ]
    });

    const jobs = await Job.find(filter).populate(
      "postedBy",
      "companyName profilePicture companyWebsite"
    );

    // Exclusively use employer's profile picture for the job logo
    const formattedJobs = jobs.map((job: any) => {
      const jobObj = job.toObject() as any;
      if (jobObj.postedBy?.profilePicture) {
        jobObj.logo = jobObj.postedBy.profilePicture;
      }
      return jobObj;
    });

    res.json(formattedJobs);
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
    const job = await Job.findById(id).populate("postedBy", "companyName profilePicture companyWebsite");
    if (!job) return res.status(404).json({ message: "Job not found" });

    const jobObj = job.toObject() as any;
    if (jobObj.postedBy?.profilePicture) {
      jobObj.logo = jobObj.postedBy.profilePicture;
    }

    res.json(jobObj);
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
    await logHistory("application", "applied", application._id as unknown as string | ObjectId, { ...application.toObject(), jobTitle: job?.position }, String(userId), req.user?.role || "user", `Applied for job: ${job?.position}`, job?.postedBy as unknown as string | ObjectId);

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
      populate: { path: "postedBy", select: "companyName profilePicture" },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const formattedSavedJobs = user.savedJobs.map((job: any) => {
      const jobObj = job.toObject() as any;
      if (jobObj.postedBy?.profilePicture) {
        jobObj.logo = jobObj.postedBy.profilePicture;
      }
      return jobObj;
    });

    res.json(formattedSavedJobs);
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
      {
        $match: {
          category: {
            $exists: true,
            $ne: "",
            // Exclude known job levels that were mistakenly saved as categories
            $nin: ["Junior", "Senior", "Middle Level", "Internship", "Entry Level"]
          },
          // Hide expired jobs from category counts
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: { $gt: new Date() } }
          ]
        }
      },
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
      await logHistory("application", status === "hired" ? "accepted" : "rejected", application._id as unknown as string | ObjectId, { ...application.toObject(), jobTitle: job.position, userName: user?.fullName }, String(userId), req.user?.role || "admin", `Application ${status}: ${user?.fullName} for ${job.position}`, job.postedBy as unknown as string | ObjectId);
    }

    res.json({ message: "Status updated successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
export const getJobsByLevel = async (req: Request, res: Response) => {
  try {
    let { level } = req.query;

    if (!level) return res.status(400).json({ message: "Job level is required" });

    // Trim and remove extra spaces/newlines
    level = String(level).trim();

    const jobs = await Job.find({ 
      jobLevel: level,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: new Date() } }
      ]
    })
      .sort({ createdAt: -1 })
      .select("companyName logo position jobLevel")
      .limit(10);

    res.status(200).json(jobs);
  } catch (err) {
    console.error("getJobsByLevel error:", err);
    res.status(500).json({ message: "Failed to fetch jobs by level" });
  }
};