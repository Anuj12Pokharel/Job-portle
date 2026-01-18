<<<<<<< HEAD
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkAdmin = (req, res, next) => {
    if (req.user?.role !== "admin" && req.user?.role !== "superadmin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
exports.default = checkAdmin;
=======
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkAdmin = (req, res, next) => {
    if (req.user?.role !== "admin" && req.user?.role !== "superadmin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
exports.default = checkAdmin;
>>>>>>> origin/job
