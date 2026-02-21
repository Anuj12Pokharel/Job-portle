import { Request, Response } from "express";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin, { IAdmin } from "../models/Admin";
import User from "../models/User";
import { sendEmail } from "../utils/mailer";
import { logHistory } from "../services/historyService";
import fs from "fs";
import path from "path";

// DEPLOY FIX TIMESTAMP: 2026-02-04 20:20 - FINAL ATTEMPT
const jwtSecret = process.env.JWT_SECRET;
const ensureSecret = () => {
  if (!jwtSecret) throw new Error("JWT_SECRET is not defined");
  return jwtSecret;
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { companyName, companyLocation, email, mobileNumber, password, confirmPassword } =
      req.body as Partial<IAdmin> & { confirmPassword?: string };

    if (!companyName || !companyLocation || !email || !mobileNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin registration failed" });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body as { identifier?: string; password?: string };
    if (!identifier || !password) {
      return res.status(400).json({ message: "Email/Phone and password are required" });
    }

    const admin = await Admin.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, ensureSecret(), {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin login failed" });
  }
};

export const forgotPasswordAdmin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+resetOTP +resetOTPExpiry");
    if (!admin) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash OTP before storing
    admin.resetOTP = await bcrypt.hash(otp, 10);
    admin.resetOTPExpiry = otpExpiry;
    await admin.save();

    try {
      await sendEmail(
        admin.email,
        "Password Reset OTP - Job Portal (Employer)",
        `Hello ${admin.companyName},\n\nYou requested to reset your password. Your OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nJob Portal Team`,
      );
    } catch (mailErr) {
      console.error("Failed to send password reset email:", mailErr);
      return res.status(500).json({ message: "Failed to send OTP email. Please try again later." });
    }

    return res.status(200).json({ message: "OTP sent to your email successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process password reset request" });
  }
};

export const resetPasswordAdmin = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body as {
      email?: string;
      otp?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+resetOTP +resetOTPExpiry");
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
    const isOTPValid = await bcrypt.compare(otp, admin.resetOTP);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update password
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetOTP = undefined;
    admin.resetOTPExpiry = undefined;
    await admin.save();

    return res.status(200).json({ message: "Password reset successfully. You can now login with your new password." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

export const getAllEmployers = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. SuperAdmin only." });
    }
    const admins = await Admin.find({ role: "admin" }).select("-password");
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch employers" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. SuperAdmin only." });
    }
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. SuperAdmin only." });
    }

    const user = await User.findById(req.params.id);
    if (user) {
      await logHistory("user", "deleted", user._id as any, user.toObject(), String(req.user?._id || (req.user as any)?.id), req.user?.role || "superadmin", `User deleted: ${user.fullName}`);
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const deleteEmployer = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. SuperAdmin only." });
    }

    const employer = await Admin.findById(req.params.id);
    if (employer) {
      await logHistory("company", "deleted", employer._id as any, employer.toObject(), String(req.user?._id || (req.user as any)?.id), req.user?.role || "superadmin", `Company deleted: ${employer.companyName}`);
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Employer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete employer" });
  }
};

export const updateUserByAdmin = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. SuperAdmin only." });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.profilePicture = req.file.path.replace(/\\/g, "/");
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const updateEmployerByAdmin = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. SuperAdmin only." });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.profilePicture = req.file.path.replace(/\\/g, "/");
    }

    const updatedEmployer = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    res.json(updatedEmployer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update employer" });
  }
};

export const verifyEmployer = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. SuperAdmin only." });
    }

    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const employer = await Admin.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");

    if (!employer) return res.status(404).json({ message: "Employer not found" });

    res.json({ message: `Employer ${status} successfully`, employer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to verify employer" });
  }
};

// Employer Profile Endpoints - FOR EMPLOYERS TO MANAGE THEIR OWN PROFILES
export const getEmployerProfile = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?._id || req.user?.id;
    console.log("Get employer profile - Admin ID:", adminId);
    console.log("User object:", req.user);

    // Check if adminId exists
    if (!adminId) {
      return res.status(401).json({ message: "No admin ID found in token" });
    }

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      console.log("Admin not found in database for ID:", adminId);
      return res.status(404).json({ message: "Employer not found. Please check if your account exists and is approved." });
    }

    // Construct full URL for profile picture if it exists and is a relative path
    let profilePictureUrl = admin.profilePicture;
    if (profilePictureUrl && !profilePictureUrl.startsWith("http")) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      profilePictureUrl = `${baseUrl}/${profilePictureUrl.replace(/\\/g, "/")}`;
    }

    res.status(200).json({
      ...admin.toObject(),
      profilePicture: profilePictureUrl,
    });
  } catch (error) {
    console.error("Get employer profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEmployerProfile = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?._id || req.user?.id;
    const { companyName, companyLocation, email, mobileNumber } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Employer not found" });
    }

    if (companyName) admin.companyName = companyName;
    if (companyLocation) admin.companyLocation = companyLocation;
    if (mobileNumber) admin.mobileNumber = mobileNumber;

    // Handle profile picture upload
    if (req.file) {
      // Delete old profile picture if it exists and is local
      if (admin.profilePicture && !admin.profilePicture.startsWith("http")) {
        const oldPath = path.join(__dirname, "..", admin.profilePicture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      admin.profilePicture = req.file.path.replace(/\\/g, "/");
    }

    // Note: Email update might require verification in a real app, keeping it simple here
    if (email && email !== admin.email) {
      const existing = await Admin.findOne({ email });
      if (existing && existing._id.toString() !== adminId) {
        return res.status(400).json({ message: "Email already in use" });
      }
      admin.email = email;
    }

    await admin.save();

    // Return updated admin
    let profilePictureUrl = admin.profilePicture;
    if (profilePictureUrl && !profilePictureUrl.startsWith("http")) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      profilePictureUrl = `${baseUrl}/${profilePictureUrl.replace(/\\/g, "/")}`;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      admin: {
        ...admin.toObject(),
        profilePicture: profilePictureUrl,
      },
    });
  } catch (error) {
    console.error("Update employer profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
