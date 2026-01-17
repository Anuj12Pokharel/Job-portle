"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            let userDoc;
            if (decoded.role === "admin") {
                userDoc = await Admin_1.default.findById(decoded.id).select("-password");
            }
            else {
                userDoc = await User_1.default.findById(decoded.id).select("-password");
            }
            if (!userDoc) {
                return res.status(401).json({ message: "User not found" });
            }
            req.user = {
                ...userDoc.toObject(),
                role: decoded.role,
                _id: userDoc._id,
                id: userDoc._id,
            };
            return next();
        }
        catch (error) {
            console.error("Auth Error:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    return res.status(401).json({ message: "Not authorized, no token" });
};
exports.protect = protect;
exports.default = exports.protect;
