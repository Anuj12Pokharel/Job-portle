"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    shift: { type: String, required: true, enum: ["morning", "day", "evening"] },
    status: {
        type: String,
        required: true,
        enum: ["pending", "enrolled", "completed", "cancelled"],
        default: "pending"
    },
    enrolledAt: { type: Date },
    completedAt: { type: Date }
}, { timestamps: true });
const Enrollment = (0, mongoose_1.model)("Enrollment", enrollmentSchema);
exports.default = Enrollment;
