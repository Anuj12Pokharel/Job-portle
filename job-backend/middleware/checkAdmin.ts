import { Request, Response, NextFunction } from "express";

const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin" && req.user?.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

export default checkAdmin;
