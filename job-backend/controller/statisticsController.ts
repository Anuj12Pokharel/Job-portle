import { Request, Response } from "express";
import User from "../models/User";
import Admin from "../models/Admin";
import Job from "../models/Job";
import Training from "../models/Training";

import Statistic from "../models/Statistic";

export const getStatistics = async (_req: Request, res: Response) => {
    try {
        // Check for manual statistics first
        const manualStats = await Statistic.findOne();

        // Count dynamic stats as fallback or for merging
        const totalCandidatesCount = await User.countDocuments({ role: "user" });
        const totalCompaniesCount = await Admin.countDocuments();
        const totalJobsCount = await Job.countDocuments();

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const dailyJobsCount = await Job.countDocuments({
            createdAt: { $gte: oneDayAgo }
        });

        const firstUser = await User.findOne().sort({ createdAt: 1 });
        let platformYearsCount = 0;
        if (firstUser && firstUser.createdAt) {
            const firstDate = new Date(firstUser.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - firstDate.getTime());
            platformYearsCount = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        }
        const dailyVisitsCount = Math.floor(totalCandidatesCount * 0.1);

        // If manual stats exist and isManual is true, use them
        if (manualStats && manualStats.isManual) {
            return res.status(200).json({
                success: true,
                data: {
                    totalCandidates: manualStats.totalCandidates || totalCandidatesCount,
                    dailyJobs: manualStats.dailyJobs || dailyJobsCount,
                    totalCompanies: manualStats.totalCompanies || totalCompaniesCount,
                    platformYears: manualStats.platformYears || platformYearsCount || 1,
                    dailyVisits: manualStats.dailyVisits || dailyVisitsCount,
                    totalJobs: manualStats.totalJobs || totalJobsCount
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                totalCandidates: totalCandidatesCount,
                dailyJobs: dailyJobsCount,
                totalCompanies: totalCompaniesCount,
                platformYears: platformYearsCount || 1,
                dailyVisits: dailyVisitsCount,
                totalJobs: totalJobsCount
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

export const updateStatistics = async (req: Request, res: Response) => {
    try {
        const {
            totalCandidates,
            dailyJobs,
            totalCompanies,
            platformYears,
            dailyVisits,
            totalJobs,
            isManual
        } = req.body;

        let stats = await Statistic.findOne();

        if (stats) {
            stats.totalCandidates = totalCandidates;
            stats.dailyJobs = dailyJobs;
            stats.totalCompanies = totalCompanies;
            stats.platformYears = platformYears;
            stats.dailyVisits = dailyVisits;
            stats.totalJobs = totalJobs;
            stats.isManual = isManual;
            await stats.save();
        } else {
            stats = await Statistic.create({
                totalCandidates,
                dailyJobs,
                totalCompanies,
                platformYears,
                dailyVisits,
                totalJobs,
                isManual
            });
        }

        res.status(200).json({
            success: true,
            message: "Statistics updated successfully",
            data: stats
        });
    } catch (error) {
        console.error("Error updating statistics:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const getTrainingStatistics = async (_req: Request, res: Response) => {
    try {
        // Count total trainings (courses available)
        const totalCourses = await Training.countDocuments();

        // Sum the 'students' field across all trainings (set by admin per training)
        const studentsAgg = await Training.aggregate([
            { $group: { _id: null, total: { $sum: "$students" } } }
        ]);
        const totalStudents = studentsAgg.length > 0 ? studentsAgg[0].total : 0;

        // Import Enrollment model for success rate calculation
        const Enrollment = (await import("../models/Enrollment")).default;

        // Count completed enrollments for success rate
        const completedEnrollments = await Enrollment.countDocuments({
            status: "completed"
        });

        // Calculate success rate (percentage of completed vs enrolled students)
        const activeEnrollments = await Enrollment.countDocuments({
            status: { $in: ["enrolled", "completed"] }
        });

        const successRate = activeEnrollments > 0
            ? Math.round((completedEnrollments / activeEnrollments) * 100)
            : 95; // Default to 95% if no data yet

        res.status(200).json({
            success: true,
            data: {
                studentsTrained: totalStudents,
                coursesAvailable: totalCourses,
                successRate: successRate,
                supportAvailable: "24/7"
            }
        });
    } catch (error) {
        console.error("Error fetching training statistics:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

