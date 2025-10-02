const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    logo: { type: String }, // company logo URL or file path
    position: { type: String, required: true }, // Job title
    category: { type: String, required: true }, // e.g., IT, Education
    location: { type: String, required: true },
    jobLevel: { type: String },
    jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
    default: "Full-time",
  },
    salary: { type: String }, // e.g., NRS 20k monthly
    educationLevel: { type: String }, // e.g., Bachelors completed
    desiredCandidate: { type: String }, // Male/Female/Both
    experience: { type: String }, // e.g., 2+ years
    expiryDate: { type: Date }, // application expiry
    description: { type: String }, // job responsibilities, skills, etc.
    aboutCompany: { type: String }, // info about company
    companyWebsite: { type: String },

    // Reference to admin who posted this job
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
