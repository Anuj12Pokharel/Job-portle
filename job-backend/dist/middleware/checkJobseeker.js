"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJobseeker = void 0;
const checkJobseeker = (req, res, next) => {
    if (req.user && req.user.role === "user") {
        next();
    }
    else {
        res.status(403).json({ message: "Access denied. Jobseekers only." });
    }
};
exports.checkJobseeker = checkJobseeker;
