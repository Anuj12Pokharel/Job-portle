"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.verifyLoginOtp = exports.sendLoginOtp = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const mailer_1 = require("../utils/mailer");
const otpStore_1 = require("../utils/otpStore");
const jwtSecret = process.env.JWT_SECRET;
const ensureSecret = () => {
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwtSecret;
};
const registerUser = async (req, res) => {
    try {
        const { fullName, preferredJobCategory, mobileNumber, email, password, confirmPassword, } = req.body;
        const validCategories = [
            "Software Development",
            "Design",
            "Marketing",
            "Sales",
            "Customer Support",
            "Human Resources",
            "Finance",
            "Operations",
        ];
        if (preferredJobCategory && !validCategories.includes(preferredJobCategory)) {
            return res.status(400).json({ message: "Invalid job category" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const newUser = new User_1.default({
            fullName,
            preferredJobCategory,
            mobileNumber,
            email,
            password,
            confirmPassword,
            role: "user",
        });
        await newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, role: newUser.role }, ensureSecret(), { expiresIn: "5d" });
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                preferredJobCategory: newUser.preferredJobCategory,
                mobileNumber: newUser.mobileNumber,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Registration failed" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ message: "Email/Phone and password are required" });
        }
        const user = await User_1.default.findOne({
            $or: [{ email: identifier }, { mobileNumber: identifier }],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, ensureSecret(), { expiresIn: "5d" });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                preferredJobCategory: user.preferredJobCategory,
                mobileNumber: user.mobileNumber,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed" });
    }
};
exports.loginUser = loginUser;
const sendLoginOtp = async (req, res) => {
    try {
        const { identifier } = req.body;
        if (!identifier) {
            return res.status(400).json({ message: "Email/Phone is required" });
        }
        const user = await User_1.default.findOne({
            $or: [{ email: identifier }, { mobileNumber: identifier }],
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // generate 6-digit otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        (0, otpStore_1.setOtp)(String(user._id), identifier, otp);
        try {
            await (0, mailer_1.sendEmail)(user.email, "Your Job Portal Login OTP", `Your OTP code is ${otp}. It expires in 5 minutes.`);
        }
        catch (mailErr) {
            console.error("Failed to send OTP email:", mailErr);
            return res.status(500).json({ message: "Failed to send OTP email" });
        }
        return res.status(200).json({ message: "OTP sent to your email" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};
exports.sendLoginOtp = sendLoginOtp;
const verifyLoginOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;
        if (!identifier || !otp) {
            return res.status(400).json({ message: "Email/Phone and OTP are required" });
        }
        const user = await User_1.default.findOne({
            $or: [{ email: identifier }, { mobileNumber: identifier }],
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const ok = (0, otpStore_1.verifyOtp)(String(user._id), identifier, otp);
        if (!ok)
            return res.status(400).json({ message: "Invalid or expired OTP" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, ensureSecret(), { expiresIn: "5d" });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                preferredJobCategory: user.preferredJobCategory,
                mobileNumber: user.mobileNumber,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "OTP verification failed" });
    }
};
exports.verifyLoginOtp = verifyLoginOtp;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User_1.default.findOne({ email: email.toLowerCase() }).select("+resetOTP +resetOTPExpiry");
        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Hash OTP before storing
        user.resetOTP = await bcryptjs_1.default.hash(otp, 10);
        user.resetOTPExpiry = otpExpiry;
        await user.save();
        try {
            await (0, mailer_1.sendEmail)(user.email, "Password Reset OTP - Job Portal", `Hello ${user.fullName},\n\nYou requested to reset your password. Your OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nJob Portal Team`);
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
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
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
        const user = await User_1.default.findOne({ email: email.toLowerCase() }).select("+resetOTP +resetOTPExpiry");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.resetOTP || !user.resetOTPExpiry) {
            return res.status(400).json({ message: "No password reset request found. Please request a new OTP." });
        }
        // Check if OTP has expired
        if (new Date() > user.resetOTPExpiry) {
            user.resetOTP = undefined;
            user.resetOTPExpiry = undefined;
            await user.save();
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }
        // Verify OTP
        const isOTPValid = await bcryptjs_1.default.compare(otp, user.resetOTP);
        if (!isOTPValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Update password
        user.password = newPassword;
        user.confirmPassword = newPassword;
        user.resetOTP = undefined;
        user.resetOTPExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully. You can now login with your new password." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to reset password" });
    }
};
exports.resetPassword = resetPassword;
