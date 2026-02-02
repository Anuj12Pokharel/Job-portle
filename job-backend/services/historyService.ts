import History from "../models/History";
import { Types } from "mongoose";

export const logHistory = async (
    entityType: "company" | "job" | "application" | "user",
    action: "created" | "deleted" | "updated" | "applied" | "accepted" | "rejected",
    entityId: Types.ObjectId | string,
    entityData: any,
    performedBy: any,
    performedByRole: string,
    details?: string,
    targetOwnerId?: any // Changed to any for more flexibility
) => {
    try {
        await History.create({
            entityType,
            action,
            entityId,
            entityData,
            performedBy,
            performedByRole,
            details,
            targetOwnerId
        });
    } catch (err) {
        console.error("Failed to log history:", err);
        // Don't throw - logging should not block main operations
    }
};

export const getHistory = async (filters: any = {}, limit: number = 100, skip: number = 0) => {
    try {
        const query: any = {};

        if (filters.entityType) {
            query.entityType = filters.entityType;
        }

        if (filters.action) {
            query.action = filters.action;
        }

        if (filters.targetOwnerId) {
            query.targetOwnerId = filters.targetOwnerId;
        }

        if (filters.startDate || filters.endDate) {
            query.createdAt = {};
            if (filters.startDate) {
                query.createdAt.$gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                query.createdAt.$lte = new Date(filters.endDate);
            }
        }

        const history = await History.find(query)
            .populate("performedBy", "fullName email")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await History.countDocuments(query);

        return { history, total };
    } catch (err) {
        console.error("Failed to fetch history:", err);
        throw err;
    }
};
