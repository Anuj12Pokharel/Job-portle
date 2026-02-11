"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnrollment = exports.updateEnrollmentStatus = exports.getEnrollments = exports.createEnrollment = void 0;
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
// Create new enrollment
const createEnrollment = async (req, res) => {
    try {
        const { name, email, phone, course, shift } = req.body;
        // Validate required fields
        if (!name || !email || !phone || !course || !shift) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        // Create enrollment
        const enrollment = await Enrollment_1.default.create({
            name,
            email,
            phone,
            course,
            shift,
            status: "pending",
            enrolledAt: new Date()
        });
        res.status(201).json({
            success: true,
            message: "Enrollment submitted successfully! We'll contact you soon.",
            data: enrollment
        });
    }
    catch (error) {
        console.error("Error creating enrollment:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.createEnrollment = createEnrollment;
// Get all enrollments (admin only)
const getEnrollments = async (_req, res) => {
    try {
        const enrollments = await Enrollment_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: enrollments
        });
    }
    catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.getEnrollments = getEnrollments;
// Update enrollment status (admin only)
const updateEnrollmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["pending", "enrolled", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }
        const updateData = { status };
        // Set completedAt date when status is completed
        if (status === "completed") {
            updateData.completedAt = new Date();
        }
        const enrollment = await Enrollment_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Enrollment status updated",
            data: enrollment
        });
    }
    catch (error) {
        console.error("Error updating enrollment:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.updateEnrollmentStatus = updateEnrollmentStatus;
// Delete enrollment (admin only)
const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const enrollment = await Enrollment_1.default.findByIdAndDelete(id);
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Enrollment deleted successfully"
        });
    }
    catch (error) {
        console.error("Error deleting enrollment:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.deleteEnrollment = deleteEnrollment;
