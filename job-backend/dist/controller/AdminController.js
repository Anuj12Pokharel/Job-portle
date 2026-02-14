"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmployer = exports.updateEmployerByAdmin = exports.updateUserByAdmin = exports.deleteEmployer = exports.deleteUser = exports.getAllUsers = exports.getAllEmployers = exports.resetPasswordAdmin = exports.forgotPasswordAdmin = exports.loginAdmin = exports.registerAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const mailer_1 = require("../utils/mailer");
const historyService_1 = require("../services/historyService");
// DEPLOY FIX TIMESTAMP: 2026-02-04 20:20 - FINAL ATTEMPT
const jwtSecret = process.env.JWT_SECRET;
const ensureSecret = () => {
    if (!jwtSecret)
        throw new Error("JWT_SECRET is not defined");
    return jwtSecret;
};
const registerAdmin = async (req, res) => {
    try {
        const { companyName, companyLocation, email, mobileNumber, password, confirmPassword } = req.body;
        if (!companyName || !companyLocation || !email || !mobileNumber || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const existingAdmin = await Admin_1.default.findOne({ email });
        if (existingAdmin)
            return res.status(400).json({ message: "Email already in use" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newAdmin = new Admin_1.default({
            companyName,
            companyLocation,
            email,
            mobileNumber,
            password: hashedPassword,
            role: "admin",
            status: "pending",
        });
        await newAdmin.save();
        // Do not return token for pending admins
        res.status(201).json({
            message: "Registration successful. Please wait for Super Admin approval before logging in.",
            admin: {
                id: newAdmin._id,
                companyName: newAdmin.companyName,
                email: newAdmin.email,
                role: newAdmin.role,
                status: newAdmin.status
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Admin registration failed" });
    }
};
exports.registerAdmin = registerAdmin;
const loginAdmin = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ message: "Email/Phone and password are required" });
        }
        const admin = await Admin_1.default.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] });
        if (!admin)
            return res.status(404).json({ message: "Admin not found" });
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ id: admin._id, role: admin.role }, ensureSecret(), {
            expiresIn: "9d",
        });
        // Check approval status for employers (admins)
        // Superadmins bypass this check
        if (admin.role === "admin" && admin.status !== "approved") {
            return res.status(403).json({
                message: admin.status === "rejected"
                    ? "Your company registration has been rejected."
                    : "Your company registration is pending approval by the Super Admin."
            });
        }
        res.status(200).json({
            token,
            admin: {
                id: admin._id,
                companyName: admin.companyName,
                companyLocation: admin.companyLocation,
                email: admin.email,
                mobileNumber: admin.mobileNumber,
                role: admin.role,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Admin login failed" });
    }
};
exports.loginAdmin = loginAdmin;
const forgotPasswordAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const admin = await Admin_1.default.findOne({ email: email.toLowerCase() }).select("+resetOTP +resetOTPExpiry");
        if (!admin) {
            return res.status(404).json({ message: "No account found with this email" });
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Hash OTP before storing
        admin.resetOTP = await bcryptjs_1.default.hash(otp, 10);
        admin.resetOTPExpiry = otpExpiry;
        await admin.save();
        try {
            await (0, mailer_1.sendEmail)(admin.email, "Password Reset OTP - Job Portal (Employer)", `Hello ${admin.companyName},\n\nYou requested to reset your password. Your OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nJob Portal Team`);
        }
        catch (mailErr) {
            console.error("Failed to send password reset email:", mailErr);
            return res.status(500).json({ message: "Failed to send OTP email. Please try again later." });
        }
        return res.status(200).json({ message: "OTP sent to your email successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to process password reset request" });
    }
};
exports.forgotPasswordAdmin = forgotPasswordAdmin;
const resetPasswordAdmin = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;
        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const admin = await Admin_1.default.findOne({ email: email.toLowerCase() }).select("+resetOTP +resetOTPExpiry");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (!admin.resetOTP || !admin.resetOTPExpiry) {
            return res.status(400).json({ message: "No password reset request found. Please request a new OTP." });
        }
        // Check if OTP has expired
        if (new Date() > admin.resetOTPExpiry) {
            admin.resetOTP = undefined;
            admin.resetOTPExpiry = undefined;
            await admin.save();
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }
        // Verify OTP
        const isOTPValid = await bcryptjs_1.default.compare(otp, admin.resetOTP);
        if (!isOTPValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Update password
        admin.password = await bcryptjs_1.default.hash(newPassword, 10);
        admin.resetOTP = undefined;
        admin.resetOTPExpiry = undefined;
        await admin.save();
        return res.status(200).json({ message: "Password reset successfully. You can now login with your new password." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to reset password" });
    }
};
exports.resetPasswordAdmin = resetPasswordAdmin;
const getAllEmployers = async (req, res) => {
    try {
        if (req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. SuperAdmin only." });
        }
        const admins = await Admin_1.default.find({ role: "admin" }).select("-password");
        res.json(admins);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch employers" });
    }
};
exports.getAllEmployers = getAllEmployers;
const getAllUsers = async (req, res) => {
    try {
        if (req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. SuperAdmin only." });
        }
        const users = await User_1.default.find().select("-password");
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    try {
        if (req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. SuperAdmin only." });
        }
        const user = await User_1.default.findById(req.params.id);
        if (user) {
            await (0, historyService_1.logHistory)("user", "deleted", user._id, user.toObject(), String(req.user?._id || req.user?.id), req.user?.role || "superadmin", `User deleted: ${user.fullName}`);
        }
        await User_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete user" });
    }
};
exports.deleteUser = deleteUser;
const deleteEmployer = async (req, res) => {
    try {
        if (req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. SuperAdmin only." });
        }
        const employer = await Admin_1.default.findById(req.params.id);
        if (employer) {
            await (0, historyService_1.logHistory)("company", "deleted", employer._id, employer.toObject(), String(req.user?._id || req.user?.id), req.user?.role || "superadmin", `Company deleted: ${employer.companyName}`);
        }
        await Admin_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Employer deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete employer" });
    }
};
exports.deleteEmployer = deleteEmployer;
const updateUserByAdmin = async (req, res) => {
    try {
        if (req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. SuperAdmin only." });
        }
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profilePicture = req.file.path.replace(/\\/g, "/");
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
        res.json(updatedUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update user" });
    }
};
exports.updateUserByAdmin = updateUserByAdmin;
const updateEmployerByAdmin = async (req, res) => {
    try {
        if (req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. SuperAdmin only." });
        }
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profilePicture = req.file.path.replace(/\\/g, "/");
        }
        const updatedEmployer = await Admin_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
        res.json(updatedEmployer);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update employer" });
    }
};
exports.updateEmployerByAdmin = updateEmployerByAdmin;
const verifyEmployer = async (req, res) => {
    try {
        if (req.user?.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. SuperAdmin only." });
        }
        const { status } = req.body;
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const employer = await Admin_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true }).select("-password");
        if (!employer)
            return res.status(404).json({ message: "Employer not found" });
        res.json({ message: `Employer ${status} successfully`, employer });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to verify employer" });
    }
};
exports.verifyEmployer = verifyEmployer;
