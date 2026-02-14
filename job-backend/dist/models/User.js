"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    permanentAddress: {
        type: String,
        default: "",
    },
    temporaryAddress: {
        type: String,
        default: "",
    },
    academicDegree: {
        type: String,
        default: "",
    },
    preferredJobCategory: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user",
    },
    savedJobs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Job" }],
    appliedJobs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Application" }],
    resetOTP: {
        type: String,
        select: false,
    },
    resetOTPExpiry: {
        type: Date,
        select: false,
    },
    cvData: {
        personalInfo: {
            fullName: { type: String },
            email: { type: String },
            phone: { type: String },
            address: { type: String },
            summary: { type: String },
        },
        education: [
            {
                institution: { type: String },
                degree: { type: String },
                startYear: { type: String },
                endYear: { type: String },
            },
        ],
        experience: [
            {
                company: { type: String },
                role: { type: String },
                duration: { type: String },
                responsibilities: { type: String },
            },
        ],
        skills: [{ type: String }],
        projects: [
            {
                name: { type: String },
                description: { type: String },
                link: { type: String },
            },
        ],
    },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = function (password) {
    return bcryptjs_1.default.compare(password, this.password);
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
