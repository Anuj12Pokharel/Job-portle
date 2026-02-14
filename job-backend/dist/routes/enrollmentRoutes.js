"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollmentController_1 = require("../controller/enrollmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public route - anyone can enroll
router.post("/", enrollmentController_1.createEnrollment);
// Protected routes - requires authentication
router.get("/", authMiddleware_1.protect, enrollmentController_1.getEnrollments);
router.put("/:id", authMiddleware_1.protect, enrollmentController_1.updateEnrollmentStatus);
router.delete("/:id", authMiddleware_1.protect, enrollmentController_1.deleteEnrollment);
exports.default = router;
