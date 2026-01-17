import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Admin from "../models/Admin";

interface DecodedToken {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as DecodedToken;

      let userDoc;
      if (decoded.role === "admin" || decoded.role === "superadmin") {
        userDoc = await Admin.findById(decoded.id).select("-password");
      } else {
        userDoc = await User.findById(decoded.id).select("-password");
      }

      if (!userDoc) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = {
        ...(userDoc.toObject() as any),
        role: decoded.role,
        _id: userDoc._id,
        id: userDoc._id,
      };

      return next();
    } catch (error: any) {
      console.error("Auth Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

export default protect;
