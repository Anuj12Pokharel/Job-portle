// controllers/adminController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const {
      companyName,
      companyLocation,
      email,
      mobileNumber,
      password,
      confirmPassword
    } = req.body;

    // Check required fields
    if (!companyName || !companyLocation || !email || !mobileNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = new Admin({
      companyName,
      companyLocation,
      email,
      mobileNumber,
      password: hashedPassword,
      confirmPassword: hashedPassword, // Optional, but you can remove this field from model later
      role: "admin"
    });

    await newAdmin.save();

    // Create token
    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.status(201).json({
      token,
      admin: {
        id: newAdmin._id,
        companyName: newAdmin.companyName,
        companyLocation: newAdmin.companyLocation,
        email: newAdmin.email,
        mobileNumber: newAdmin.mobileNumber,
        role: newAdmin.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin registration failed" });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or mobileNumber

    if (!identifier || !password) {
      return res.status(400).json({ message: "Email/Phone and password are required" });
    }

    // Find admin by email or mobileNumber
    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }]
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        companyName: admin.companyName,
        companyLocation: admin.companyLocation,
        email: admin.email,
        mobileNumber: admin.mobileNumber,
        role: admin.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin login failed" });
  }
};
