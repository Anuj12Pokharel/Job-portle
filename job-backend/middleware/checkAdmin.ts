import { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("checkAdmin middleware called - User role:", req.user?.role);

    // Check if user has admin role
    if (req.user?.role !== "admin" && req.user?.role !== "superadmin") {
      console.log("checkAdmin - Access denied: User role is", req.user?.role);
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // For non-superadmin, verify the admin account is approved
    if (req.user?.role === "admin") {
      const adminId = req.user._id || req.user.id;
      if (adminId) {
        const admin = await Admin.findById(adminId).select("status");
        if (!admin) {
          console.log("checkAdmin - Admin account not found for ID:", adminId);
          return res.status(401).json({ message: "Admin account not found." });
        }
        if (admin.status === "pending") {
          console.log("checkAdmin - Admin status is pending for ID:", adminId);
          return res.status(403).json({
            message: "Your company registration is pending approval by the Super Admin."
          });
        }
        if (admin.status === "rejected") {
          console.log("checkAdmin - Admin status is rejected for ID:", adminId);
          return res.status(403).json({
            message: "Your company registration has been rejected."
          });
        }
        console.log("checkAdmin - Admin approved for ID:", adminId, "Status:", admin.status);
      }
    }

    console.log("checkAdmin - Access granted for role:", req.user?.role);
    next();
  } catch (error) {
    console.error("checkAdmin middleware error:", error);
    return res.status(500).json({ message: "Server error in admin verification." });
  }
};

export default checkAdmin;
