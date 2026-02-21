import mongoose from "mongoose";

const StatisticSchema = new mongoose.Schema(
    {
        totalCandidates: { type: Number, default: 0 },
        dailyJobs: { type: Number, default: 0 },
        totalCompanies: { type: Number, default: 0 },
        platformYears: { type: Number, default: 0 },
        dailyVisits: { type: Number, default: 0 },
        totalJobs: { type: Number, default: 0 },
        // Use manual values if true
        isManual: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Statistic", StatisticSchema);
