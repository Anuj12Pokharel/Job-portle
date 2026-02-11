"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    companyName: { type: String, required: true },
    logo: { type: String },
    position: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    jobLevel: {
        type: String,
        enum: ["Entry-level", "Mid-level", "Senior-level", "Junior", "Executive"],
    },
    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
        default: "Full-time",
    },
    salary: { type: String },
    educationLevel: { type: String },
    desiredCandidate: { type: String },
    experience: { type: String, required: true },
    expiryDate: { type: Date },
    description: { type: String },
    noOfOpenings: { type: String },
    industry: { type: String },
    vehicleLicense: { type: String },
    twoFourWheeler: { type: String },
    skills: { type: String },
    aboutCompany: { type: String },
    companyWebsite: { type: String },
    postedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin", required: true },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });
const Job = (0, mongoose_1.model)("Job", jobSchema);
exports.default = Job;
