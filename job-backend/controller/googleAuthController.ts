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
    const { idToken } = req.body as { idToken?: string };
    if (!idToken) return res.status(400).json({ message: "idToken is required" });
    if (!client) return res.status(500).json({ message: "Google client not configured on server" });

    const ticket = await client.verifyIdToken({ idToken, audience: googleClientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).json({ message: "Invalid Google token payload" });

    const email = payload.email.toLowerCase();
    const fullName = payload.name || "";

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Incorrect Email" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "5d" });

    return res.status(200).json({
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
  } catch (err) {
    console.error("Google sign-in error:", err);
    return res.status(500).json({ message: "Google sign-in failed" });
  }
};
