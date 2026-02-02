"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadProfile_1 = __importDefault(require("../middleware/uploadProfile"));
const router = (0, express_1.Router)();
router.get("/profile", authMiddleware_1.protect, userController_1.getProfile);
router.put("/profile", authMiddleware_1.protect, uploadProfile_1.default.single("profilePicture"), userController_1.updateProfile);
exports.default = router;
