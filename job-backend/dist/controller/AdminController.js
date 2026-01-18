<<<<<<< HEAD
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordAdmin = exports.forgotPasswordAdmin = exports.loginAdmin = exports.registerAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const mailer_1 = require("../utils/mailer");
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
        });
        await newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ id: newAdmin._id, role: newAdmin.role }, ensureSecret(), {
            expiresIn: "9d",
        });
        res.status(201).json({
            token,
            admin: {
                id: newAdmin._id,
                companyName: newAdmin.companyName,
                companyLocation: newAdmin.companyLocation,
                email: newAdmin.email,
                mobileNumber: newAdmin.mobileNumber,
                role: newAdmin.role,
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
=======
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordAdmin = exports.forgotPasswordAdmin = exports.loginAdmin = exports.registerAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const mailer_1 = require("../utils/mailer");
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
        });
        await newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ id: newAdmin._id, role: newAdmin.role }, ensureSecret(), {
            expiresIn: "9d",
        });
        res.status(201).json({
            token,
            admin: {
                id: newAdmin._id,
                companyName: newAdmin.companyName,
                companyLocation: newAdmin.companyLocation,
                email: newAdmin.email,
                mobileNumber: newAdmin.mobileNumber,
                role: newAdmin.role,
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
>>>>>>> origin/job
