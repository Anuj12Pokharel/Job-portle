import { Request, Response, NextFunction } from "express";

export const checkJobseeker = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "user") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Jobseekers only." });
    }
};
