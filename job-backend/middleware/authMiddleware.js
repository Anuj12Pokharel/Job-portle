// middleware/protect.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the correct user (Admin or User) based on role
      let userDoc;
      if (decoded.role === "admin") {
        userDoc = await Admin.findById(decoded.id).select("-password");
      } else {
        userDoc = await User.findById(decoded.id).select("-password");
      }

      // If no user found
      if (!userDoc) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user and role to request
      req.user = {
        ...userDoc.toObject(),
        role: decoded.role,
      };

      return next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // No token at all
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
