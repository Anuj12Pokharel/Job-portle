const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String }, // file path or URL
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ["applied", "reviewed", "shortlisted", "rejected", "hired"],
      default: "applied"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
