import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";

const jwtSecret = process.env.JWT_SECRET || "change_me_in_prod";
const googleClientId = process.env.GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.warn("GOOGLE_CLIENT_ID is not set in environment. Google sign-in will fail until configured.");
}

const client = googleClientId ? new OAuth2Client(googleClientId) : null;

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { idToken, role: expectedRole } = req.body as { idToken?: string, role?: string };
    if (!idToken) return res.status(400).json({ message: "idToken is required" });
    if (!client) return res.status(500).json({ message: "Google client not configured on server" });

    const ticket = await client.verifyIdToken({ idToken, audience: googleClientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).json({ message: "Invalid Google token payload" });

    const email = payload.email.toLowerCase();

    let user: any = null;
    let role = "user";

    // Strict role check requested
    if (expectedRole === "admin") {
      const GoogleAdmin = require("../models/Admin").default;
      user = await GoogleAdmin.findOne({ email });
      if (user) {
        role = user.role;
        if (role === "admin" && user.status !== "approved") {
          return res.status(403).json({
            message: user.status === "rejected"
              ? "Your company registration has been rejected."
              : "Your company registration is pending approval by the Super Admin."
          });
        }
      } else {
        // If strictly asking for admin and not found
        return res.status(404).json({ message: "No Employer account found with this email." });
      }
    } else if (expectedRole === "user") {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "No Job Seeker account found with this email." });
      }
      role = user.role;
    } else {
      // Fallback logic for legacy/undefined role (try User, then Admin)
      user = await User.findOne({ email });
      if (!user) {
        const GoogleAdmin = require("../models/Admin").default;
        user = await GoogleAdmin.findOne({ email });
        if (user) role = user.role;
      }
    }

    if (!user) {
      return res.status(404).json({ message: "Incorrect Email. No account found." });
    }

    // Prepare response data based on role
    const responseData: any = {
      token: jwt.sign({ id: user._id, role: role }, jwtSecret, { expiresIn: "5d" }),
    };

    if (role === "user") {
      responseData.user = {
        id: user._id,
        fullName: user.fullName,
        preferredJobCategory: user.preferredJobCategory,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role,
      };
    } else {
      responseData.user = { // Frontend GoogleSignIn expects 'user' key currently, but we can send generic or specific
        id: user._id,
        companyName: user.companyName,
        email: user.email,
        role: user.role, // 'admin' or 'superadmin'
        status: user.status
      };
      // Also send 'admin' key for clarity if needed, but frontend might just use 'user'
      responseData.admin = responseData.user;
    }

    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Google sign-in error:", err);
    return res.status(500).json({ message: "Google sign-in failed" });
  }
};
