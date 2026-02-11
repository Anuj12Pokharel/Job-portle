"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingStatistics = exports.getStatistics = void 0;
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Job_1 = __importDefault(require("../models/Job"));
const Training_1 = __importDefault(require("../models/Training"));
const getStatistics = async (_req, res) => {
    try {
        // Count total jobseekers (users with role "user")
        const totalCandidates = await User_1.default.countDocuments({ role: "user" });
        // Count total employers (admins)
        const totalCompanies = await Admin_1.default.countDocuments();
        // Count total jobs
        const totalJobs = await Job_1.default.countDocuments();
        // Calculate jobs posted in last 24 hours (daily jobs)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const dailyJobs = await Job_1.default.countDocuments({
            createdAt: { $gte: oneDayAgo }
        });
        // Calculate platform age in years (from first user registration)
        const firstUser = await User_1.default.findOne().sort({ createdAt: 1 });
        let platformYears = 0;
        if (firstUser && firstUser.createdAt) {
            const firstDate = new Date(firstUser.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - firstDate.getTime());
            platformYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        }
        // For daily visits, you would typically use analytics data
        // For now, we'll calculate based on recent job applications/activity
        // You can integrate with Google Analytics API or track visits in database
        const dailyVisits = Math.floor(totalCandidates * 0.1); // Approximate 10% daily active users
        res.status(200).json({
            success: true,
            data: {
                totalCandidates,
                dailyJobs,
                totalCompanies,
                platformYears: platformYears || 1, // Minimum 1 year
                dailyVisits,
                totalJobs
            }
        });
    }
    catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.getStatistics = getStatistics;
const getTrainingStatistics = async (_req, res) => {
    try {
        // Count total trainings (courses available)
        const totalCourses = await Training_1.default.countDocuments();
        // Import Enrollment model
        const Enrollment = (await Promise.resolve().then(() => __importStar(require("../models/Enrollment")))).default;
        // Count total students who enrolled (any status)
        const totalEnrollments = await Enrollment.countDocuments();
        // Count completed enrollments for success rate
        const completedEnrollments = await Enrollment.countDocuments({
            status: "completed"
        });
        // Calculate success rate (percentage of completed vs enrolled students)
        // Only count enrolled and completed students for the calculation
        const activeEnrollments = await Enrollment.countDocuments({
            status: { $in: ["enrolled", "completed"] }
        });
        const successRate = activeEnrollments > 0
            ? Math.round((completedEnrollments / activeEnrollments) * 100)
            : 95; // Default to 95% if no data yet
        // Support available is always 24/7 (static but included for completeness)
        const supportAvailable = "24/7";
        res.status(200).json({
            success: true,
            data: {
                studentsTrained: totalEnrollments,
                coursesAvailable: totalCourses,
                successRate: successRate,
                supportAvailable: supportAvailable
            }
        });
    }
    catch (error) {
        console.error("Error fetching training statistics:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.getTrainingStatistics = getTrainingStatistics;
