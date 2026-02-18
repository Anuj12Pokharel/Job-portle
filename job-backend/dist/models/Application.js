<<<<<<< HEAD
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const applicationSchema = new mongoose_1.Schema({
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String },
    coverLetter: { type: String },
    totalExperience: { type: Number },
    expectedSalary: { type: String },
    fieldOfExpertise: { type: String },
    additionalInfo: { type: String },
    status: {
        type: String,
        enum: ["applied", "viewing", "hiring-process", "hired", "rejected"],
        default: "applied",
    },
}, { timestamps: true });
const Application = (0, mongoose_1.model)("Application", applicationSchema);
exports.default = Application;
=======
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const applicationSchema = new mongoose_1.Schema({
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String },
    coverLetter: { type: String },
    totalExperience: { type: Number }, // New field
    expectedSalary: { type: String }, // New field
    fieldOfExpertise: { type: String }, // New field
    additionalInfo: { type: String }, // New field
    status: {
        type: String,
        enum: ["applied", "viewing", "hiring-process", "hired", "rejected"],
        default: "applied",
    },
}, { timestamps: true });
const Application = (0, mongoose_1.model)("Application", applicationSchema);
exports.default = Application;
>>>>>>> origin/updated-feature
