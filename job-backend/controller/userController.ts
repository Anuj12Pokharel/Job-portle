import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import fs from "fs";
import path from "path";

// Extend Request to include user from auth middleware
interface AuthRequest extends Request {
    user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Normalize profile picture path to be relative to the server root (starting with uploads/)
        let profilePicture = user.profilePicture;
        if (profilePicture && !profilePicture.startsWith("http")) {
            const cleanedPath = profilePicture.replace(/\\/g, "/");
            const uploadsIndex = cleanedPath.indexOf("uploads/");
            profilePicture = uploadsIndex !== -1 ? cleanedPath.slice(uploadsIndex) : cleanedPath;
        }

        res.status(200).json({
            ...user.toObject(),
            profilePicture,
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { fullName, email, mobileNumber, preferredJobCategory, location } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (fullName) user.fullName = fullName;
        if (mobileNumber) user.mobileNumber = mobileNumber;
        if (preferredJobCategory) user.preferredJobCategory = preferredJobCategory;
        if (location) user.location = location;

        // Handle profile picture upload
        if (req.file) {
            // Delete old profile picture if it exists and is local
            if (user.profilePicture && !user.profilePicture.startsWith("http")) {
                const oldPath = path.join(__dirname, "..", user.profilePicture);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            user.profilePicture = req.file.path;
        }

        // Note: Email update might require verification in a real app, keeping it simple here
        if (email && email !== user.email) {
            const existing = await User.findOne({ email });
            if (existing && existing._id.toString() !== userId) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        await user.save();

        // Return updated user with normalized profile picture path
        let profilePicture = user.profilePicture;
        if (profilePicture && !profilePicture.startsWith("http")) {
            const cleanedPath = profilePicture.replace(/\\/g, "/");
            const uploadsIndex = cleanedPath.indexOf("uploads/");
            profilePicture = uploadsIndex !== -1 ? cleanedPath.slice(uploadsIndex) : cleanedPath;
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                ...user.toObject(),
                profilePicture,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
