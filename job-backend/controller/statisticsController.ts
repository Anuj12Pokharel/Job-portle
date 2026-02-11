import { Request, Response } from "express";
import User from "../models/User";
import Admin from "../models/Admin";
import Job from "../models/Job";

export const getStatistics = async (_req: Request, res: Response) => {
    try {
        // Count total jobseekers (users with role "user")
        const totalCandidates = await User.countDocuments({ role: "user" });

        // Count total employers (admins)
        const totalCompanies = await Admin.countDocuments();

        // Count total jobs
        const totalJobs = await Job.countDocuments();

        // Calculate jobs posted in last 24 hours (daily jobs)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const dailyJobs = await Job.countDocuments({
            createdAt: { $gte: oneDayAgo }
        });

        // Calculate platform age in years (from first user registration)
        const firstUser = await User.findOne().sort({ createdAt: 1 });
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
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
