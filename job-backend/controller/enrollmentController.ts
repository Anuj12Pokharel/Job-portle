import { Request, Response } from "express";
import Enrollment from "../models/Enrollment";

// Create new enrollment
export const createEnrollment = async (req: Request, res: Response) => {
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
        const enrollment = await Enrollment.create({
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
    } catch (error) {
        console.error("Error creating enrollment:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Get all enrollments (admin only)
export const getEnrollments = async (_req: Request, res: Response) => {
    try {
        const enrollments = await Enrollment.find().sort({ createdAt: -1 });

        res.status(200).json(enrollments);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Update enrollment status (admin only)
export const updateEnrollmentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "enrolled", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const updateData: any = { status };

        // Set completedAt date when status is completed
        if (status === "completed") {
            updateData.completedAt = new Date();
        }

        const enrollment = await Enrollment.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

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
    } catch (error) {
        console.error("Error updating enrollment:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Delete enrollment (admin only)
export const deleteEnrollment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const enrollment = await Enrollment.findByIdAndDelete(id);

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
    } catch (error) {
        console.error("Error deleting enrollment:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
