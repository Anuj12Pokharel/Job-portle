"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Construct full URL for profile picture if it exists and is a relative path
        let profilePictureUrl = user.profilePicture;
        if (profilePictureUrl && !profilePictureUrl.startsWith("http")) {
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            profilePictureUrl = `${baseUrl}/${profilePictureUrl.replace(/\\/g, "/")}`;
        }
        res.status(200).json({
            ...user.toObject(),
            profilePicture: profilePictureUrl,
        });
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, email, mobileNumber, preferredJobCategory, location } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (fullName)
            user.fullName = fullName;
        if (mobileNumber)
            user.mobileNumber = mobileNumber;
        if (preferredJobCategory)
            user.preferredJobCategory = preferredJobCategory;
        if (location)
            user.location = location;
        // Handle profile picture upload
        if (req.file) {
            // Delete old profile picture if it exists and is local
            if (user.profilePicture && !user.profilePicture.startsWith("http")) {
                const oldPath = path_1.default.join(__dirname, "..", user.profilePicture);
                if (fs_1.default.existsSync(oldPath)) {
                    fs_1.default.unlinkSync(oldPath);
                }
            }
            user.profilePicture = req.file.path;
        }
        // Note: Email update might require verification in a real app, keeping it simple here
        if (email && email !== user.email) {
            const existing = await User_1.default.findOne({ email });
            if (existing && existing._id.toString() !== userId) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }
        await user.save();
        // Return updated user
        let profilePictureUrl = user.profilePicture;
        if (profilePictureUrl && !profilePictureUrl.startsWith("http")) {
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            profilePictureUrl = `${baseUrl}/${profilePictureUrl.replace(/\\/g, "/")}`;
        }
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                ...user.toObject(),
                profilePicture: profilePictureUrl,
            },
        });
    }
    catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateProfile = updateProfile;
